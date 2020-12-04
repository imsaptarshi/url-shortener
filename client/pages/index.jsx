import Head from "next/head";
import { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import styles from "../styles/Home.module.css";
import axios from "axios";

export default function Home() {
  const [actualUrl, setActualUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState({
    base: "http://localhost:3000",
    url: undefined,
  });

  const [isLink, setIsLink] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const validateUrl = () => {
    const exp = new RegExp(
      "(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})"
    );
    const res =
      exp.test(actualUrl) &&
      (actualUrl.startsWith("https://") || actualUrl.startsWith("http://"));
    setIsLink(res);
    return res;
  };

  const handleSubmit = (e) => {
    if (validateUrl()) {
      axios
        .post(`http://localhost:8080/url/add`, {
          actual_url: actualUrl,
        })
        .then((res) => {
          setShortenedUrl({
            base: "http://localhost:3000",
            url: res.data.shortened_url,
          });
          setIsCopied(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const copyHandler = () => {
    let tempInput = document.createElement("input");
    tempInput.value = shortenedUrl.base + shortenedUrl.url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    setIsCopied(true);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="/">Url Shortener</a>
        </h1>

        <p className={styles.description}>
          Tired of sharing long urls?
          <code className={styles.code}>you've come to the right place!</code>
        </p>
        <form style={{ display: "flex", marginBottom: "20px" }}>
          <TextField
            error={!isLink}
            id="outlined-basic"
            label="Enter url here"
            variant="outlined"
            required
            className="input-field"
            onChange={(e) => {
              setActualUrl(e.target.value);
            }}
            style={{ width: "500px" }}
          />
          <Button
            variant="contained"
            style={{
              backgroundColor: "#0070f3",
              color: "white",
              fontWeight: "bold",
              borderTopLeftRadius: "0",
              borderBottomLeftRadius: "0",
            }}
            onClick={handleSubmit}
          >
            Shorten URL
          </Button>
        </form>
        {shortenedUrl.url && (
          <span style={{ display: "flex" }}>
            <TextField
              id="shortened-link"
              error={false}
              id="outlined-basic"
              variant="outlined"
              className="input-field"
              value={
                shortenedUrl.url !== undefined
                  ? shortenedUrl.base + shortenedUrl.url
                  : ""
              }
              style={{ width: "540px" }}
            />
            <Button
              variant="contained"
              style={{
                backgroundColor: "#0070f3",
                color: "white",
                fontWeight: "bold",
                borderTopLeftRadius: "0",
                borderBottomLeftRadius: "0",
              }}
              onClick={copyHandler}
            >
              {!isCopied ? "Copy URL" : "Copied!"}
            </Button>
          </span>
        )}
      </main>
      <footer className={styles.footer}>Made by Saptarshi</footer>
    </div>
  );
}
