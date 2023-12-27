import { Button } from "shards-react";
import { loadStripe } from '@stripe/stripe-js'
import config from "../config.json";
import axios from 'axios'

const stripePromise = loadStripe(
    'pk_test_51JibLGHOFtiwRajcCOgyocEKJRu0u5IihfcnagHzodxdaEVNxmvaIXMpOHBldgouqeqBPqhfipanwGTID4yhPRvl003T4ULBVP'
)


const Stripe = () => {
    const startPayment = async () => {

        const data = {
            Url: window.location.href.toString(),
        }

        try {
            const response = await axios.post(`${config.apps.VoiceSenseAPI.url}/paymentTest`);
            window.open(response.data, '_blank', 'noopener noreferrer');
        } catch (error) {
            console.error('Error:', error);
        }

    }

    return (
        <div style={{ height: '100px' }}>
            <Button theme='dark' onClick={() => startPayment()} type="submit">
                Upgrade Now
            </Button>

        </div>
    )
}

export default Stripe;