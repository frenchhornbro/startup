import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';
import './about.css';

export function About() {
    const [imageURL, setImageUrl] = React.useState('');

    React.useEffect(() => {
        (async () => {
            try {
                if (Math.random()*10 > 1) {
                    const duck = await fetch('/api/duck');
                    const duckImg = await duck.json();
                    setImageUrl(duckImg.duck)
                }
                else {
                    setImageUrl("..\\..\\budgie-images\\about-budgie.jpg");
                }
            }
            catch {
                console.log("Load Image Error");
                setImageUrl("..\\..\\budgie-images\\about-budgie.jpg");
            }
        })();
    }, []);

    return (
        <main>
            <div className="about-main-container">
                <div className="log-out"></div>
                <h2 className="title-container">About</h2>
                <p>
                    Budgie is a free and simple financial application to help you plan out your budget according to
                    your expected income and expenses.
                </p>
                <div>
                    <div style={{fontWeight: 'bold'}}>How it works:</div>
                    <p>
                        Create a theoretical, or "Projected", budget based on roughly what you expect your income and expenses will be.
                        You can change this later! This will help you see how much you're making per month, as well as overall, based
                        on that plan. This will help you to see if you need to pinch pennies for the next while, or if you don't need
                        to be so tight on spending. When you receive a paycheck or pay a bill, put that in your "Actual". This will
                        help you know how well you're following your projected budget. If you'd like, you can afterwards edit your
                        projected budget to more accurately reflect your expectations for the year, or you can keep it as a goal to work
                        towards and spend accordingly in the months to come.
                    </p>
                </div>
                <div>
                    <div style={{fontWeight: 'bold'}}>Want to work together?</div>
                    <p>
                      You can add friends, request to view and edit their budgets, and send messages in the Home tab.
                      Setting a budget's privacy setting to "Public" will allow your friends to see it and be able to
                      request access. If a budget is listed as "Private", it will be visible to you only.
                    </p>
                </div>
                <div className="img-frame-container">
                    <div className="about-img-frame">
                        <img alt="Two Budgies" src={imageURL} className="bird-img" />
                    </div>
                </div>
            </div>
        </main>
    );
}