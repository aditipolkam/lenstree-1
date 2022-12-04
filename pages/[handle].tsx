import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  client,
  getPublications,
  getProfile,
  getAddressByHandle,
} from "../api";
import getAllLinks from "./api/getAllLinks";
import Link from "next/link";

type Profile = {
  id: number;
  handle: string;
  avatarUrl: string;
  bio: string;
};

type Publication = {
  id: number;
  metadata: any;
};

export default function Profile() {
  const [userHandle, setUserHandle] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [links, setLinks] = useState<
    { id: number; name: string; url: string }[]
  >([]);
  /* create initial state to hold user profile and array of publications */
  const [profile, setProfile] = useState<Profile>({
    id: 0,
    avatarUrl: "",
    bio: "",
    handle: "",
  });
  const [publications, setPublications] = useState<Publication[]>([]);

  const router = useRouter();
  const { handle } = router.query;
  console.debug("Query Paramenteres: ", router.query);

  useEffect(() => {
    async function fetchProfile(handle: string) {
      try {
        /* fetch the user profile using their handle */
        const returnedProfile = await client.query({
          query: getProfile,
          variables: { handle },
        });
        const profileData = { ...returnedProfile.data.profile };
        //console.log(returnedProfile);
        /* format their picture if it is not in the right format */
        const picture = profileData.picture;
        if (picture && picture.original && picture.original.url) {
          if (picture.original.url.startsWith("ipfs://")) {
            let result = picture.original.url.substring(
              7,
              picture.original.url.length
            );
            profileData.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`;
          } else {
            profileData.avatarUrl = profileData.picture.original.url;
          }
          setProfile(profileData);
          /* fetch the user's publications from the Lens API and set them in the state */
          const pubs = await client.query({
            query: getPublications,
            variables: {
              id: profileData.id,
              limit: 50,
            },
          });
          setPublications(pubs.data.publications.items);
        }
      } catch (err: any) {
        console.log("error", err);
      }
    }
    try {
      if (handle && typeof handle === "string") {
        if (handle.endsWith(".lens")) {
          //setUserHandle(handle);
          fetchProfile(handle);
          getAddress(handle).then((address) => {
            console.log("Setting user address to ", address);
            setUserAddress(address);
          });
        } else {
          setUserAddress(handle);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [handle]);
  useEffect(() => {
    console.log("Wallet Address", userAddress);
    getAllLinks(userAddress).then((res) => {
      console.debug(res);
      setLinks(res);
    });
  }, [userAddress]);

  async function getAddress(handle: string) {
    try {
      console.log("querying for handle: ", handle);
      const addressProfile = await client.query<any>({
        query: getAddressByHandle,
        variables: { handle },
      });
      console.log("found address", addressProfile);
      return addressProfile?.data.profile.ownedBy;
    } catch (error) {
      console.log(error);
    }
  }

  if (!profile) {
    return null;
  } else {
    return (
      <div className="flex flex-col items-center">
        <div className="profile-details flex flex-col items-center">
          <Image
            alt="test"
            className=""
            width={200}
            height={200}
            src={profile.avatarUrl}
          />
          <p className="text-xl font-bold font-Josefin">@{profile.handle}</p>
          <p className="text-center font-semibold">{profile.bio}</p>
        </div>
        <div className="profile-publications text-center">
          {publications.map((pub) => (
            <div key={pub.id} className="">
              <span className="inline-block">{">>>>"}</span><p>{pub.metadata.content}</p>
            </div>
          ))}
        </div>
        <div className="links-section">
          The Links Shared are
          <ul>
            {links.map((link) => {
              return (
                <div className="border-solid m-2 p-4 border-cyan-300 bg-gray-300 border-1 rounded-sm text-center " key={link.id}>
                  <a href={link.url} target={"_blank"} rel="noreferrer">
                    {link.name}
                  </a>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}
