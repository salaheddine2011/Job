import { Link } from 'react-router-dom';
import Wrapped from '../assets/wrappers/ErrorPage.js';
import img from '../assets/images/not-found.svg'
const Error = () => {
    return <Wrapped className='full-page'>
        <div>
            <img src={img} alt='not found' />
            <h3>Ohh! Page not found</h3>
            <p>We can't seem to find the page you're looking for </p>
            <Link to="/">Back to home </Link>
        </div>
    </Wrapped>
}
export default Error;
