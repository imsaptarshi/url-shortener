import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Redirect() {
  const router = useRouter();
  const { surl } = router.query;

  const [actualUrl, setActualUrl] = useState(undefined);

  axios
    .get(`http://localhost:8080/url/${surl}`)
    .then((res) => {
      setActualUrl(res.data.actual_url);
    })
    .catch((err) => {
      console.log(err);
    });

  return (
    <span>
      {actualUrl && (
        <>
          <Head>
            <meta http-equiv="refresh" content={`1; URL=${actualUrl}`} />
          </Head>
          <p>
            Redirecting to <code>{actualUrl}</code>
          </p>
        </>
      )}
    </span>
  );
}
