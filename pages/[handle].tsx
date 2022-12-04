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
    try {
      if (handle && typeof handle === "string") {
        if (handle.endsWith(".lens")) {
          //setUserHandle(handle);
          fetchProfile();
          getAddress(handle).then((addr) =>
            setUserAddress(addr?.data.profile.ownedBy)
          );
          //setUserAddress(addr);
        } else {
          console.log("hi", userAddress);
          //fetchLinks(userAddress);
        }
        fetchLinks();
      }
    } catch (err) {
      console.error(err);
    }
  }, [handle]);

  async function getAddress(handle: string) {
    try {
      console.log("querying for handle: ", handle);
      const addressProfile = await client.query<any>({
        query: getAddressByHandle,
        variables: { handle },
      });
      console.log("addr", addressProfile);
      return addressProfile;
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchProfile() {
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

  async function fetchLinks() {
    const links = await getAllLinks(handle);
    console.log(links);
  }

  if (!profile) {
    return null;
  } else {
    return (
      <div className="profile-frame">
        <div className="links-section">
          {links.map((link) => {
            return (
              <div key={link.id}>
                <a href={link.url} target={"_blank"} rel="noreferrer">
                  {link.name}
                </a>
              </div>
            );
          })}
        </div>
        <div className="profile-details">
          <Image
            alt="test"
            className=""
            width={200}
            height={200}
            src={profile.avatarUrl}
          />
          <p className="">{profile.handle}</p>
          <p className="">{profile.bio}</p>
        </div>
        <div className="profile-publications">
          {publications.map((pub) => (
            <div key={pub.id} className="">
              <p>{pub.metadata.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
