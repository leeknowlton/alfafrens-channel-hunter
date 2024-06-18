"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UsernameInput from "./UsernameInput";

interface FIDFormProps {
  onSubmit: (fid1: string, fid2: string) => void;
}

const FIDForm: React.FC<FIDFormProps> = ({ onSubmit }) => {
  const [myFid, setMyFid] = useState<string>("");
  const [theirFid, setTheirFid] = useState<string>("");
  const [myUsername, setMyUsername] = useState<string>("");
  const [theirUsername, setTheirUsername] = useState<string>("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      fid1: myFid,
      fid2: theirFid,
    }).toString();
    router.push(`/vennfrens?${queryParams}`);
    onSubmit(myFid, theirFid);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-6 w-full max-w-lg mx-auto form-control"
    >
      <div className="flex gap-10">
        <UsernameInput
          label="USER ONE"
          value={myUsername}
          onValueChange={setMyUsername}
          onFidChange={setMyFid}
        />
        <UsernameInput
          label="USER TWO"
          value={theirUsername}
          onValueChange={setTheirUsername}
          onFidChange={setTheirFid}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

export default FIDForm;
