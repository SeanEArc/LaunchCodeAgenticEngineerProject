import { Link } from 'react-router-dom';
import { BalancedMeal, Protein, Carbs, Fats } from '../assets/foodIcons/foodIcons';
import logCaloriesImage from '../assets/HowItWorksImages/Log-Calories-Image.png';
import quickLogImage from '../assets/HowItWorksImages/Quick-Log-Image.png';
import logFoodImage from '../assets/HowItWorksImages/Log-Food-Image.png';
import calorieHistoryImage from '../assets/HowItWorksImages/Calorie-History.png';
import modifyButtonImage from '../assets/HowItWorksImages/Modify-Button-Image.png';
import editingImage from '../assets/HowItWorksImages/Modify-Food.png';
import deleteButtonImage from '../assets/HowItWorksImages/Delete-Button-Image.png';
import { UserContext } from './UserContext';
import { useContext } from 'react';

const HowItWorks = () => {
    const { isLoggedIn } = useContext(UserContext);

    return (
        <div className="max-w-6xl mx-auto p-6 text-center">
            <hr className="mx-10 my-5 bg-gray-400 border-0.5" />

            <h1 className="text-3xl font-bold mb-2">So How Does This All Work? </h1>
            <p className="text-gray-600 mb-6">
                {' '}
                Your first step in accomplishing your diet goals!{' '}
            </p>

            <hr className="mx-10 bg-gray-400 border-0.5" />

            <div className="grid gap-6 my-4 sm:grid-cols-1 md:grid-cols-2">
                <div className="md:my-10 sm:my-0">
                    <h2> Log a Item </h2>
                    <p className="text-gray-600 text-pretty">
                        {' '}
                        To log an item, just click on the "Log Food" or "Quick Log" button{' '}
                    </p>

                    <img
                        src={logCaloriesImage}
                        alt="Log Calories Image"
                        className="mx-auto border shadow mb-2 rounded"
                    />

                    <img
                        src={quickLogImage}
                        alt="Quick Log Image"
                        className="mx-auto border shadow"
                    />

                    <p className="text-gray-600 text-pretty">
                        {' '}
                        *These button's is for reference only
                    </p>
                </div>

                <div>
                    <h2> Enter Details </h2>
                    <p className="text-gray-600 text-pretty">
                        {' '}
                        Follow the form's input. Please note, Macro input is option; however, it is
                        recommended{' '}
                    </p>

                    <img
                        src={logFoodImage}
                        alt="Log Food Details Image"
                        className="mx-auto border shadow rounded-2xl scale-90"
                    />
                </div>

                <div className=" md:col-span-2 sm:col-auto">
                    <h2> Calorie History </h2>
                    <p className="text-gray-600 text-pretty pb-2">
                        {' '}
                        The "Calorie History" button's will display all of your logged item's and
                        add up all of your inputs!{' '}
                    </p>

                    <img
                        src={calorieHistoryImage}
                        alt="Calorie History Example Image"
                        className="mx-auto border shadow rounded-2xl"
                    />
                </div>

                <h2 className="md:col-span-2"> Made a mistake? No Problem! </h2>

                <div className="md:py-5 sm:py-0">
                    <h2> Easy Editing! </h2>
                    <p className="text-gray-600 text-pretty">
                        {' '}
                        Click on modify and underneath our totaled calculations will display an
                        editing form{' '}
                    </p>

                    <img
                        src={modifyButtonImage}
                        alt="Modify Button Image"
                        className="mx-auto border shadow rounded-2xl scale-90"
                    />

                    <h2 className="pt-4"> Want to remove an entry? </h2>
                    <p className="text-gray-600 text-pretty">
                        {' '}
                        Follow the form's input. Please note, Macro input is option; however, it is
                        recommended{' '}
                    </p>

                    <img
                        src={deleteButtonImage}
                        alt="Delete Button Image"
                        className="mx-auto border shadow rounded-2xl"
                    />
                </div>

                <div>
                    <h2> Quick and Easy </h2>
                    <p className="text-gray-600 text-pretty">
                        {' '}
                        Update the value's you want and our software will update the numbers
                        automatically!{' '}
                    </p>

                    <img
                        src={editingImage}
                        alt="Editing Example Image"
                        className="mx-auto border shadow rounded-2xl scale-90"
                    />
                </div>
            </div>

            <hr className="mx-10 my-15 bg-gray-400 border-0.5" />

            <div>
                <h1 className="text-3xl font-bold mb-2"> - What Do The Icons Mean? - </h1>

                <div>
                    <table className="min-w-full border-collapse table-auto">
                        <thead>
                            <tr className="text-center">
                                <th className="px-4 py-4">
                                    <img
                                        src={Protein}
                                        alt=""
                                        className="h-25 w-25 object-contain mx-auto"
                                    />
                                </th>

                                <th className="px-4 py-4">
                                    <img src={Carbs} className="h-25 w-25 object-contain mx-auto" />
                                </th>

                                <th className="px-4 py-4">
                                    <img src={Fats} className="h-25 w-25 object-contain mx-auto" />
                                </th>

                                <th className="px-4 py-4">
                                    <img
                                        src={BalancedMeal}
                                        className="h-25 w-25 object-contain mx-auto"
                                    />
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="bg-gray-200 font-medium">
                                <td> Meat </td>
                                <td> Bag Of Wheat </td>
                                <td> Oil Bottles </td>
                                <td> Bowl of Food </td>
                            </tr>

                            <tr className="bg-gray-100">
                                <td className="px-4 py-4">
                                    This symbolizes that the largest marco nutrient is "Protein" in
                                    the tracked food item{' '}
                                </td>
                                <td className="px-4 py-4">
                                    This symbolizes that the largest marco nutrient is
                                    "Carbohydrates" in the tracked food item
                                </td>
                                <td className="px-4 py-4">
                                    This symbolizes that the largest marco nutrient is "Fats" in the
                                    tracked food item
                                </td>
                                <td className="px-4 py-4">
                                    {' '}
                                    This symbolizes that the food item is balanced in it's Macro's;
                                    however, this will also appear if there are no macro nutrient's
                                    logged{' '}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="my-10">
                <p className="text-lg mb-4 font-medium">
                    Ready to begin your journey? Head over to your dashboard and start tracking
                    today!
                </p>

                {/* If the user is logged in, it sends them to their dashboard. Else, sends them to
                        the login page. */}
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

export default HowItWorks;
