"use client";
import { decryptMessage, encryptMessage, formDataToBuffer } from "@/util";
import axios from "axios";
import CryptoJS from "crypto-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const backend = "http://localhost:9000";

const k = Buffer.from(
  "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4",
  "hex"
).toString("base64");

const Page = () => {
  const photoRef = useRef<HTMLInputElement>(null);
  const [pokemons, setPokemons] = useState<
    { name: string; description: string; image: string }[]
  >([]);
  const [image, setImage] = useState<File | null>(null);
  const getPokemons = async () => {
    const poksResponse = await axios.get(backend + "/pokemons");
    const dec = decryptMessage(
      poksResponse.data.encryptedData,
      poksResponse.data.iv
    );

    const data = JSON.parse(
      Buffer.from(Buffer.from(dec, "hex").toString(), "hex").toString()
    );
    console.log("dec 2", data);
    setPokemons(data || []);
  };

  useEffect(() => {
    getPokemons();
    const text = "hello world";
    const iv = CryptoJS.enc.Hex.parse(k);
    const enc = encryptMessage(Buffer.from(text), iv);
    const dec = decryptMessage(enc, iv);

    console.log(
      "dec",
      Buffer.from(Buffer.from(dec, "hex").toString(), "hex").toString()
    );
  }, []);

  return (
    <div className="mx-auto container p-8 max-h-screen h-screen space-y-8 overflow-hidden grid [grid-template-rows:auto_1fr]">
      <h1 className="text-4xl text-center">Pokemons</h1>
      <div className="flex gap-8">
        <div className="w-[40%]">
          <h2 className="text-2xl ml-2">Add pokemon</h2>
          <form
            className="space-y-8"
            onSubmit={async (e) => {
              e.preventDefault();

              const iv = CryptoJS.enc.Hex.parse(k);
              const formData = new FormData(e.currentTarget);
              const buf = await formDataToBuffer(formData);
              const encryptedData = encryptMessage(buf.buffer, iv);

              await axios.post(backend + "/pokemons", {
                encryptedData,
                iv,
                boundary: buf.boundary,
              });
            //   await axios.post(backend + "/pokemons2", formData);
              await getPokemons();
            }}
          >
            <div
              className="relative cursor-pointer h-[150px] overflow-hidden rounded-md border border-foreground grid place-content-center mt-5"
              onClick={() => {
                if (!photoRef.current) return;

                photoRef.current.click();
              }}
            >
              {image ? (
                <div className="absolute top-0 left-0 overflow-hidden w-full h-full">
                  <Image
                    src={URL.createObjectURL(image)}
                    height={150}
                    width={300}
                    alt="preview"
                    className="w-full object-cover object-center h-full"
                  />
                </div>
              ) : null}
              <p className="text-foreground text-2xl text-center z-10 relative">
                <span className="text-4xl font-extrabold">+</span>
                <br />
                Add photo
              </p>
              <input
                type="file"
                name="image"
                ref={photoRef}
                hidden
                onChange={(e) => {
                  setImage(e.target.files?.[0] || null);
                }}
              />
            </div>
            <div className="grid space-y-2">
              <label htmlFor="" className="ml-2">
                Nom
              </label>
              <input
                type="text"
                name="name"
                className="text-foreground border border-foreground rounded-md h-[40px] bg-background pl-2 outline-none"
              />
            </div>
            <div className="grid space-y-2">
              <label htmlFor="" className="ml-2">
                Description
              </label>
              <textarea
                name="desc"
                rows={4}
                className="resize-none text-foreground border border-foreground rounded-md bg-background pl-2 outline-none"
              />
            </div>
            <div className="grid">
              <button
                type="submit"
                className="bg-foreground bg-opacity-45 rounded-md h-[40px] text-background"
              >
                <span>ADD</span>
              </button>
            </div>
          </form>
        </div>
        <div className="w-[60%] grid grid-cols-2 overflow-y-scroll h-[calc(100vh-136px)] gap-6 pokview">
          {pokemons.toReversed().map((pokemon, index) => {
            return (
              <div
                key={`pokemon-${index}`}
                className="h-[300px] border border-foreground rounded-md overflow-hidden"
              >
                <div className="h-[200px] overflow-hidden">
                  <Image
                    src={pokemon.image}
                    height={250}
                    width={300}
                    alt={pokemon.name}
                    className="h-[200px] w-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <p className="text-lg font-bold">{pokemon.name}</p>
                  <p className=" w-full overflow-hidden h-[50px]">
                    {pokemon.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
