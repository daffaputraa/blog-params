import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import parse from "html-react-parser";

const DetailArtikel = () => {
  const { slug } = useParams();
  const [artikel, setArtikel] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  function createSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/artikel/kajian");

        if (response.status === 200) {
          const dataRaw = response.data;
          const foundArticle = dataRaw.find(
            (ele) => createSlug(ele.judul_artikel) === slug
          );

          if (foundArticle) {
            setFilteredData(foundArticle);
            setArtikel(foundArticle);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [slug]);

  return (
    <>
      <Helmet>
        <title>{artikel ? artikel.judul_artikel : "Article Page"}</title>
        <meta
          name="description"
          content={artikel?.deskripsi || "Deskripsi artikel"}
        />
        <meta
          name="keywords"
          content={artikel?.judul_artikel || "Keyword1, Keyword2"}
        />
        <meta name="author" content={artikel?.penulis || "Nama Penulis"} />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="ID" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:type" content="article" />
        <meta
          property="og:title"
          content={artikel?.judul_artikel || "Judul Artikel"}
        />
        <meta
          property="og:url"
          content={`https://slibiw.com/artikel/${slug}`}
        />
        <meta
          property="og:description"
          content={artikel?.deskripsi || "Deskripsi artikel"}
        />
        <meta
          property="og:image"
          content={
            filteredData
              ? `api/getimage/${filteredData.gambar}`
              : "default-image-url.jpg"
          }
        />
        <meta property="og:site_name" content="Slibiw" />
        <meta property="og:locale" content="id_ID" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={artikel?.judul_artikel || "Judul Artikel"}
        />
        <meta
          name="twitter:url"
          content={`https://slibiw.com/artikel/${slug}`}
        />
        <meta
          name="twitter:description"
          content={artikel?.deskripsi || "Deskripsi artikel"}
        />
        <meta
          name="twitter:image"
          content={
            filteredData
              ? `api/getimage/${filteredData.gambar}`
              : "default-image-url.jpg"
          }
        />
        <link rel="canonical" href={`https://slibiw.com/artikel/${slug}`} />
      </Helmet>

      <main className="max-w-[900px] mx-auto p-9 flex flex-col gap-10">
        <h1 className="text-4xl text-left">
          {artikel ? artikel.judul_artikel : "Loading..."}
        </h1>
        <img
          src={
            filteredData?.gambar
              ? `/api/getimage/${filteredData.gambar}`
              : "default-image-url.jpg"
          }
          className="max-w-[600px]"
          alt={filteredData?.judul_artikel || "Gambar tidak tersedia"}
        />
        <p>{parse(artikel ? artikel.deskripsi : "Loading...")}</p>
      </main>
    </>
  );
};

export default DetailArtikel;
