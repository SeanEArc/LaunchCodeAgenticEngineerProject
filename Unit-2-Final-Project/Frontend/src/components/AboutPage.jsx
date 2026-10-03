import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useContext } from 'react';
import { UserContext } from './UserContext';

const AboutPage = () => {
    const { isLoggedIn } = useContext(UserContext);

    const futurePlans = [
        "A Search Bar (to track commonly found food's faster!)",
        'Visual Enhancements',
        'Date Tracking',
        'Tracking',
        'Dark Mode',
        'Image Upload',
    ];

    const firstColumn = futurePlans.slice(0, 3);
    const secondColumn = futurePlans.slice(3);

    return (
        <div className="max-w-6xl mx-auto p-6 text-center">
            <hr className="mx-10 my-5 bg-gray-300 border-0.5" />

            <div className="my-5">
                <h1 className="text-3xl font-bold mb-1"> - Our Story - </h1>
                <p className="text-gray-600"> How did we get here? </p>

                <hr className="mx-10 my-5 bg-gray-300 border-0.5" />
            </div>

            <div className="mt-10 mx-20">
                <h2> Why was this made? </h2>

                <p>
                    {' '}
                    This website was made for the purpose of helping people track their dieting
                    needs. Whether it is for losing, gaining, or maintaining weight, we're here to
                    help! We help our user's total their calorie intake and macro's per session.
                    Since this is just the start of our project, we are going to be continuously
                    reshaping and adding more fetures to eventually make it a overall health and
                    fitness app!{' '}
                </p>

                <div className="col-span-2 mt-5">
                    <h2> Future Plans? </h2>
                    <p>
                        {' '}
                        Our plans for this website is to take it further by adding additional
                        features such as{' '}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 sm:grid-cols-1 my-10 md:mx-10 sm:w-full">
                    <div>
                        <ul className="list-disc ml-4">
                            {firstColumn.map((plan, index) => (
                                <li key={index}> {plan}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <ul className="list-disc ml-4">
                            {secondColumn.map((plan, index) => (
                                <li key={index}> {plan}</li>
                            ))}

                            <li>
                                <h4> AND MORE! </h4>
                            </li>
                        </ul>
                    </div>

                    <p className="col-span-2 pt-10 mx-auto max-w-4xl text-center font-semibold">
                        {' '}
                        Although our team of 1 person is still learning, we are trying our best to
                        deliver you the features that you deserve in an overall health and fitness
                        app!
                    </p>
                </div>
            </div>

            <hr className="mx-10 my-5 bg-gray-300 border-0.5" />

            <div className="grid gap-4 my-4 sm:grid-cols-1 md:grid-cols-2">
                <h1 className="col-span-2"> Want to learn a little more about the Developer? </h1>

                <div className="md:my-3 sm:my-0">
                    <img
                        src={logo}
                        alt="Our Founder"
                        className="mx-auto md:h-50 sm:10 border shadow mb-2 rounded-full"
                    />

                    <h2> Founder of Calorie Counter </h2>
                    <p className="text-gray-600">
                        {' '}
                        *He doesn't like portraits so here is our logo{' '}
                    </p>
                </div>

                <div className="md:my-10 sm:my-10">
                    <h2> There's not to much to this story </h2>

                    <p className="py-2">
                        {' '}
                        Born in the United Kingdom and raised in the United States, SEEA. is an
                        aspiring software developer that is still learning the ropes. Everyday, he
                        learns more and more about the software developer journey and will continue
                        to make projects that make's him a better problem solver!{' '}
                    </p>
                </div>
            </div>

            <hr className="mx-10 my-5 bg-gray-400 border-0.5" />

            <div className="my-10">
                <p className="text-lg mb-4 font-medium">
                    Ready to begin your journey? Head over to your dashboard and start tracking
                    today!
                </p>

                {isLoggedIn ? (
                    <Link
                        to="/dashboard"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
                    >
                        Go to Dashboard
                    </Link>
                ) : (
                    <Link
                        to="/"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
                    >
                        Go to Dashboard
                    </Link>
                )}
            </div>

            <hr className="mx-10 my-15 bg-gray-400 border-0.5" />

            <div>
                <h1> Don't know where to start? </h1>

                <h2 className="text-gray-800 text-pretty">
                    {' '}
                    We all know that feeling and we are here to help!{' '}
                </h2>

                <h4 className="text-gray-600 text-pretty pt-5">
                    {' '}
                    Everyone needs some sort of guidance when starting their journey whether it's
                    losing, gaining, or maintaining weight. We've provided a couple of resources to
                    help you get started!{' '}
                </h4>

                <div className="grid grid-cols-3">
                    <a
                        href="https://www.dietaryguidelines.gov/"
                        target="Dietary-Guidelines"
                        className="inline-block mt-4 mx-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                    >
                        View Dietary Guidelines
                    </a>

                    <a
                        href="https://www.nutrition.gov/"
                        target="Nutrition-Gov-Website"
                        className="inline-block mt-4 mx-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                    >
                        nutrition.gov
                    </a>

                    <a
                        href="https://www.calculator.net/ideal-weight-calculator.html?ctype=standard&cage=25&csex=m&cheightfeet=5&cheightinch=10&cheightmeter=180&printit=0&x=Calculate"
                        target="Ideal-Weight-Calculator"
                        className="inline-block mt-4 mx-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                    >
                        Ideal Weight Calculator
                    </a>
                </div>
            </div>

            <hr className="mx-10 mt-10 mb-5 bg-gray-400 border-0.5" />

            <p className="text-gray-500 mb-10">
                {' '}
                *Please note, although we may provide some resources to assist in your journey, you
                are ultimately responsible in completing your own research.
            </p>
        </div>
    );
};

export default AboutPage;
