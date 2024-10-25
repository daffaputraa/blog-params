import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";

const DetailArtikel = () => {
  const { slug } = useParams();
  const [anime, setAnime] = useState(null);
  const baseUrl = "https://your-domain.com"; // Ganti dengan domain Anda

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://new-anime-api.vercel.app/all-anime"
        );

        if (response.status === 200) {
          const foundAnime = response.data.find((item) => item.slug === slug);
          if (foundAnime) {
            setAnime(foundAnime);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [slug]);

  // Helper function untuk membuat description yang lebih baik
  const getFormattedDescription = () => {
    if (!anime) return "";
    return `${anime.title} - ${anime.description}. Status: ${anime.status}, Rating: ${anime.rating}, Type: ${anime.type}`;
  };

  // Helper function untuk membuat keywords dari genre
  const getKeywords = () => {
    if (!anime?.genres) return "";
    return (
      anime.genres.map((genre) => genre.name).join(", ") +
      ", anime, " +
      anime.title
    );
  };

  if (!anime) {
    return (
      <div className="max-w-[900px] mx-auto p-9">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{anime.title}</title>
        <meta name="description" content={getFormattedDescription()} />
        <meta name="keywords" content={getKeywords()} />
        <meta name="author" content="Your Site Name" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en" />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={anime.title} />
        <meta property="og:description" content={getFormattedDescription()} />
        <meta property="og:image" content={anime.thumbnail} />
        <meta property="og:url" content={`${baseUrl}/read/${anime.slug}`} />
        <meta property="og:site_name" content="Your Site Name" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={anime.title} />
        <meta name="twitter:description" content={getFormattedDescription()} />
        <meta name="twitter:image" content={anime.thumbnail} />
        <meta name="twitter:url" content={`${baseUrl}/read/${anime.slug}`} />

        {/* Canonical URL */}
        <link rel="canonical" href={`${baseUrl}/read/${anime.slug}`} />
      </Helmet>

      <main className="max-w-[900px] mx-auto p-9 flex flex-col gap-10">
        <h1 className="text-4xl text-left font-bold">{anime.title}</h1>

        <div className="aspect-video relative overflow-hidden rounded-lg">
          <img
            src={anime.thumbnail}
            className="object-cover w-full h-full"
            alt={anime.title}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {anime.genres.map((genre) => (
            <span
              key={genre.slug}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <h3 className="text-gray-500 text-sm">Rating</h3>
            <p className="font-semibold">{anime.rating}</p>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Status</h3>
            <p className="font-semibold">{anime.status}</p>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Type</h3>
            <p className="font-semibold">{anime.type}</p>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Viewers</h3>
            <p className="font-semibold">{anime.viewers}</p>
          </div>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
          <p className="text-gray-700 leading-relaxed">{anime.description}</p>
        </div>
      </main>
    </>
  );
};

export default DetailArtikel;
