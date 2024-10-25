import React from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";

const Card = ({ judul, img, deskripsi }) => {
  function createSlug(title) {
    return title
      .toLowerCase() // Ubah ke huruf kecil
      .trim() // Hapus spasi di awal dan akhir
      .replace(/[^\w\s-]/g, "") // Hapus karakter khusus
      .replace(/\s+/g, "-") // Ganti spasi dengan tanda hubung
      .replace(/-+/g, "-"); // Ganti tanda hubung ganda menjadi satu
  }

  const slug = createSlug(judul);

  return (
    <>
      <Link to={`artikel/${slug}`}>
        <article className="p-5 bg-neutral-50 border border-neutral-100 rounded shadow shadow-neutral-200">
          <img src={img} className="max-w-48" alt={judul} />{" "}
          {/* Berikan alt yang relevan */}
          <div>
            <h1 className="font-bold text-xl text-gray-800">{judul}</h1>
            <p className="font-normal text-base text-gray-500">
              {parse(deskripsi)}
            </p>
          </div>
        </article>
      </Link>
    </>
  );
};

export default Card;
