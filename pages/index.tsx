import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';

import { useEffect, useState } from 'react';

export default function Home() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    async function fetchSurveys() {
      const res = await fetch('/api/surveys');
      const data = await res.json();
      setSurveys(data);
    }
    fetchSurveys();
  }, []);

  return (
    <div>
      <h1>Surveys</h1>
      <ul>
        {surveys.map((survey) => (
          <li key={survey.id}>
            <a href={`/surveys/${survey.id}`}>{survey.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
