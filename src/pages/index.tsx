import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from "date-fns/locale/pt-BR";
import { api } from '../services/api';
import { convertDurationToTimeString } from '../util/convertDurationToTimeString';

type Episode = {
  id: string;
  title: string;
  member: string;
};
type HomeProps = {
  episodes: Array<Episode>;
};
export default function Home(props: HomeProps) {
  return (
    <>
      <h1>Index</h1>
      <p>{}</p>
    </>
  )
}
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
  const episodes = data.map(episode =>{
    return{
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      member: episode.member,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };
  });
  return{ 
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  } 
}