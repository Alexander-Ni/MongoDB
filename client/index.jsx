import React, { useEffect, useState } from "react";
import style from "./style.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Router, Routes } from "react-router-dom";

function FrontPage() {
  return (
    <div>
      <h1>MOVIE TESTTTT</h1>
      <ul>
        <li>
          <Link to={"/movies"}>List movies</Link>
        </li>
        <li>
          <Link to={"/movies/new"}>Add new movie</Link>
        </li>
      </ul>
    </div>
  );
}

function useLoading(loadingFunction) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [data, setData] = useState();

  async function load() {
    try {
      setLoading(true);
      setData(await loadingFunction());
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);
  return { loading, error, data };
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to load " + res.status + ": " + res.statusText);
  }
  return await res.json();
}

function MovieCard({
  movie: { countries, directors, plot, poster, title, year },
}) {
  return (
    <>
      <div id={"bord"}>
        <h3>
          {" "}
          {title} ({year})
        </h3>
        {directors && (
          <div>
            <strong>Directed by:</strong> {directors.join(", ")}
          </div>
        )}

        <p>
          <strong>Plot: </strong> {plot}
        </p>
        <p>
          <strong> Country:</strong> {countries}
        </p>
      </div>
    </>
  );
}
async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`${res.status}: ${res.statusText}`);
  }
}

function FormInput({ label, value, setValue }) {
  return (
    <div>
      <div>
        <label>{label}</label>
      </div>
      <div>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
    </div>
  );
}

function FormTextarea({ label, value, setValue }) {
  return (
    <div>
      <div>
        <label>{label}</label>
      </div>
      <div>
        <textarea value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
    </div>
  );
}
function AddMovie() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [director, setDirector] = useState("");
  const [plot, setPlot] = useState("");
  const [country, setCountry] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await postJSON("/api/movies", {
      title,
      year: parseInt(year),
      directors: [director],
      plot: plot,
      countries: [country],
    });
    setTitle("");
    setYear("");
    setDirector("");
    setPlot("");
    setCountry("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add new movie</h2>
      <FormInput label={"Title"} value={title} setValue={setTitle} />
      <FormInput label={"Year"} value={year} setValue={setYear} />
      <FormInput label={"Director"} value={director} setValue={setDirector} />
      <FormInput label={"Country"} value={country} setValue={setCountry} />
      <FormTextarea label={"Full plot"} value={plot} setValue={setPlot} />
      <div>
        <button disabled={title.length === 0 || year.length === 0}>Save</button>
      </div>
    </form>
  );
}
function ListMovies() {
  const { loading, error, data } = useLoading(async () =>
    fetchJSON("/api/movies")
  );

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <div>{error.toString()}</div>
      </div>
    );
  }
  return (
    <div>
      <h1>Movies in the database</h1>

      {data.map((movie) => (
        <MovieCard key={movie.title} movie={movie} />
      ))}
    </div>
  );
}

function AddNewMovie() {
  return (
    <form>
      <h1>Add new movie</h1>
    </form>
  );
}

function Application() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<FrontPage />} />
        <Route path={"/movies"} element={<ListMovies />} />
        <Route path={"/movies/new"} element={<AddMovie />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("app")).render(<Application />);
