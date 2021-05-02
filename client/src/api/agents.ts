import { useQuery } from "react-query";
import axios from "axios";
export interface Crew {
  name: string;
  role: string;
}

export interface IMovie {
  title: string;
  releaseDate: string;
  overview: string;
  userScore: string;
  imgUrl: string;
  crew: Crew[];
}
const getData = (url: string) => {
  return useQuery<IMovie, Error>(["movie", url], async () => {
    const { data } = await axios.post(
      `http://localhost:3001/movie/find?title=${url}`
    );
    return data;
  });
};

export { getData };
