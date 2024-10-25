import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import parse from "html-react-parser";

const Home = () => {
  const [dataRaw, setDataRaw] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(
          "https://new-anime-api.vercel.app/all-anime"
        );
        if (data.status == 200) {
          setDataRaw(data.data);
          console.log(data.data);
        }
      } catch (error) {
        console.log(`pesan error ${error}`);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <main>
        <div className="main-container grid grid-cols-2 gap-5 px-5">
          {dataRaw.length === 0 && <h1>loading...</h1>}

          {dataRaw &&
            dataRaw.map((element, index) => (
              <>
                <Card
                  slug={element.slug}
                  key={element.id}
                  img={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiMiU13NSLEbvv05jC6EJULEMoO2WefneexQ&s`}
                  judul={element.title}
                  deskripsi={element.description}
                />
              </>
            ))}
        </div>
      </main>
    </>
  );
};

export default Home;
