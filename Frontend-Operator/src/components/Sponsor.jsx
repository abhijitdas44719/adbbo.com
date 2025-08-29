import React from 'react'
import './Sponsor.css'

function Sponsor() {

    const contactBtns = document.querySelectorAll('.contact-btn');

    contactBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const method = this.textContent.trim();

            switch (method) {
                case 'Contact Us':
                    window.open('mailto:abhijitdas44719@gmail.com?subject=Sponsor Request');
                    break;

            }
        });
    });

    return (
        <div>
            <section class="hero">
                <h1>Partner with Us</h1>
                <p>Support smart travel and showcase your brand to thousands of daily passengers.</p>
            </section>


            <section class="sponsorship">
                <h2>Sponsorship Opportunities</h2>
                <div class="tiers">

                    {/* bronze */}
                    <div class="tier bronze">
                        <h3>Bronze</h3>
                        <p>Get your logo featured on our website and app footer.</p>
                        <div class="price">₹10,000 / month</div>
                        <ul>
                            <li>Logo on Website</li>
                            <li>Mention in Newsletter</li>
                        </ul>
                        <a id='bronze-button' href="#contact">Choose Bronze</a>
                    </div>

                    {/* silver */}
                    <div class="tier silver">
                        <h3>Silver</h3>
                        <p>Feature your brand in app banners and booking emails.</p>
                        <div class="price">₹25,000 / month</div>
                        <ul>
                            <li>Everything in Bronze</li>
                            <li>Banner in App(ADIBUS)</li>
                            <li>Mention in Booking Emails</li>
                        </ul>
                        <a href="#contact">Choose Silver</a>
                    </div>

                    {/* gold */}
                    <div class="tier gold">
                        <h3>Gold</h3>
                        <p>Premium sponsorship with full visibility across platform.</p>
                        <div class="price">₹50,000 / month</div>
                        <ul>
                            <li>Everything in Silver</li>
                            <li>Logo on Bus Tickets</li>
                            <li>Exclusive Campaigns</li>
                        </ul>
                        <a href="#contact">Choose Gold</a>
                    </div>

                </div>
            </section>

            {/* contact section */}
            <section class="contact" id="contact">
                <h2>Ready to Sponsor?</h2>
                <p>Fill out our sponsorship form and our team will contact you shortly.</p>
                <button className="contact-btn">Contact Us</button>
            </section>
        </div>
    )
}

export default Sponsor
