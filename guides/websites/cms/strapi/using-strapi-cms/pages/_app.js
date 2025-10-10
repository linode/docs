// Imports the CSS file that loads in Tailwind CSS.
import './globals.css'

// Defines the base template for the pages. This example just
// adds a container element around the page content.
const ExampleApp = ({ Component, pageProps }) => {
  return (
    <div className="container mx-auto p-4">
      <Component {...pageProps} />
    </div>
  )
}

export default ExampleApp

