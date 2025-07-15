import { PhonesList } from '../components/PhonesList'

const Home = () => {
  console.log('All env vars:', Object.keys(process.env))
  console.log('Your var:', process.env.NEXT_PUBLIC_API_KEY)

  return <PhonesList />
}

export default Home
