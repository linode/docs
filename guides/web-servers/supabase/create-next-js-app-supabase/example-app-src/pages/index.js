// Import the head element and the default styles module. Edit this CSS file,
// or use a new one, to define your own application styles.
import Head from 'next/head'
import styles from '../styles/Home.module.css'

// Import a component to handle the shopping list logic and rendering.
import ShoppingList from '../components/ShoppingList.js'

// Define the layout of the page. Most of the actual content for this
// example gets processed in the ShoppingList component.
export default function Home() {
  return (
    <div className={styles.container}>
        <Head>
            <title>Example Next.js App</title>
        </Head>

        <main className={styles.main}>
            <h1 className={styles.title}>Shopping List</h1>
            <ShoppingList />
        </main>
    </div>
  )
}
