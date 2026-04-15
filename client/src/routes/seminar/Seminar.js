import React, { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import {
    Card,
    CardBody,
    CardImg,
    CardSubtitle,
    CardTitle,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    List,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
} from 'reactstrap';
import CompanyLogo from '../../components/companyLogo/CompanyLogo';
import { useTextScramble } from '../../hooks/useTextScramble';
import { API } from '../../util/API';
import ProfilePic from './profilePic.jpg';
import './Seminar.sass';

const location = {
    coordinates: [38.98520709907486, -94.66967884584639],
    addressFirstLine: '7925 Marty St',
    addressSecondLine: 'Overland Park, KS 66204',
};

const Seminar = () => {
    const scramble = useTextScramble();
    const [formSuccess, setFormSuccess] = useState(false);
    const [formFail, setFormFail] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        attendanceType: 'In-Person',
        company: '',
        jobTitle: '',
        hearAboutUs: '',
        specialRequests: '',
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        // Clear the validation error when the user starts typing
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        console.log('formData :>> ', formData);
    };

    const clearForm = () => {
        setFormData({
            fullname: '',
            email: '',
            phoneNumber: '',
            company: '',
            jobTitle: '',
            hearAboutUs: '',
            specialRequests: '',
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullname.trim()) {
            newErrors.fullname = 'Full Name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone Number is required';
        }

        return newErrors;
    };

    const handleSignUp = (e) => {
        e.preventDefault();

        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            API.submitSeminarSignupForm(formData)
                .then(() => {
                    clearForm();
                    setFormFail(false);
                    setFormSuccess(true);
                })
                .catch((error) => {
                    console.log(error);
                    setFormSuccess(false);
                    setFormFail(true);
                });
        }
    };

    return (
        <div className='Seminar'>
            <div className='landingSection py-5'>
                <div className='container'>
                    <h2 className='fw-light'>
                        Introduction to the Development of Large-Bay storage
                    </h2>
                    <p className='text-muted'>April 24th-25th, 2026</p>
                    <p className='fw-light text-uppercase'>Hosted By</p>
                    <CompanyLogo textOnly />
                </div>
            </div>
            <div className='contentSection py-5'>
                <div className='overviewSection gunMetalBackground'>
                    <div className='container py-5'>
                        <div className='row py-5'>
                            <div className='col-12 col-md-6 py-5'>
                                <div className='d-flex align-items-center mb-4 themeText'>
                                    <i className='fas fa-sitemap' />
                                    <h2 className='ms-3 mb-0'>Overview</h2>
                                </div>
                                <p>
                                    Real estate development is a complex and
                                    multifaceted process. This in-person course
                                    will focus on <b>Large-Bay storage</b>, a
                                    quickly growing niche of commercial real
                                    estate that bridges the gap between mini
                                    storage and flex industrial.
                                </p>
                                <p>
                                    This course is presented by{' '}
                                    <i>Contractor Garage&trade;</i>, the leading
                                    brand in large-bay storage, since 2009. We
                                    will walk through all stages of the
                                    development process; preventing you from
                                    making mistakes, shortening your learning
                                    curve, and helping you get it right from the
                                    beginning.
                                </p>
                            </div>
                            <div className='col-12 col-md-6 py-5'>
                                <div className='d-flex align-items-center mb-4 themeText'>
                                    <i className='fas fa-clipboard' />
                                    <h2 className='ms-3 mb-0'>Format</h2>
                                </div>
                                <p>
                                    This will be a <b>2 day course</b> starting
                                    with the basics. Day 1 will be{' '}
                                    <i>“down to the nitty gritty” </i>
                                    located in a private event space at{' '}
                                    <i>Brew Lab</i>, a local neighborhood
                                    brewpub in Overland Park, Kansas. Lunch and
                                    happy hour drinks will be provided. Day 2
                                    will include a guided tour of our properties
                                    in the greater Kansas City metro area.
                                </p>
                                <p>Class size will be limited to 20 people.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='speakerSection'>
                    <div className='container py-5'>
                        <div className='row py-5'>
                            <div className='d-flex align-items-center mb-4'>
                                <i className='fas fa-microphone' />
                                <h2 className='ms-3 mb-0'>
                                    Introduction To Speaker
                                </h2>
                            </div>
                            <div className='col-12 pb-3 col-lg-4 pb-lg-0'>
                                <Card>
                                    <CardBody>
                                        <CardTitle className='fw-bold'>
                                            Kevin Combs
                                        </CardTitle>
                                        <CardSubtitle className='text-secondary'>
                                            CCIM
                                        </CardSubtitle>
                                        <div className='d-flex justify-content-center'>
                                            <CardImg
                                                className='profilePic'
                                                src={ProfilePic}
                                            />
                                        </div>
                                    </CardBody>
                                    <ListGroup className='small' flush>
                                        <ListGroupItem>
                                            B.S. Mechanical Engineering, Kansas
                                            State University 2002
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            Certified Commercial Investment
                                            Member (CCIM) 2009, received through
                                            rigorous education, proven
                                            transactional experience, and
                                            ethics.
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            Licensed general contractor (Johnson
                                            County, KS Class A)
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            Licensed real estate broker (Kansas
                                            and Missouri)
                                        </ListGroupItem>
                                    </ListGroup>
                                </Card>
                            </div>
                            <div className='col-12 col-lg-8'>
                                <p>
                                    After leaving engineering and the corporate
                                    rat race in 2005, Kevin started his
                                    commercial real estate career focusing his
                                    efforts on the industrial market in Kansas
                                    City. As the young guy eager to earn a few
                                    bucks as a broker during those initial
                                    months, Kevin was happy to accept the meager
                                    commissions from the tiniest of
                                    entrepreneurs. These small business owners
                                    needed 500-1000 square feet, for $500-1000
                                    per month. However, mini storage did not
                                    work and flex space was too expensive. These
                                    types of spaces did not exist in Kansas
                                    City, and it turns out, the nation. In an
                                    effort to stop filling the trash can full of
                                    good-leads gone cold, he built his first{' '}
                                    <i>Contractor Garage&trade;</i> in 2008 in
                                    the middle of a recession using private
                                    funds. He and his investors quickly learned
                                    his spaces were recession proof, filling up
                                    before construction was finished during a
                                    poor economy.
                                </p>
                                <p>
                                    After speaking to interested developers
                                    across the country for years, he redesigned
                                    the <i>Contractor Garage&trade;</i> website
                                    in 2022 and trademarked the brand to launch
                                    the concept nationally. With experience as a
                                    general contractor, syndicator, leasing
                                    agent, and property manager, he is the ideal
                                    consultant. He can help others to build a{' '}
                                    <i>Contractor Garage&trade;</i> and earn
                                    passive income of their own.{' '}
                                </p>
                                <p>
                                    Kevin continues to develop commercial real
                                    estate in the Kansas City market currently
                                    working on his 9th project. His goals are to
                                    grow and share the{' '}
                                    <i>Contractor Garage&trade;</i> brand with
                                    others across the nation. He is married to
                                    his wife Laura, and father to a son and
                                    fraternal twin daughters. He enjoys all the
                                    hobbies and travel his passive income allows
                                    him and his family: skiing, sailing,
                                    camping, golfing, and mountain biking, to
                                    name a few.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='scheduleSection bg-body-secondary'>
                    <div className='container py-5'>
                        <div className='row py-5'>
                            <div className='d-flex align-items-center mb-4'>
                                <i className='fas fa-calendar-alt' />
                                <h3 className='ms-3 mb-0'>Schedule</h3>
                            </div>
                            <div className='col-12 col-md-6'>
                                <div>
                                    <label className='fw-bold'>Dates:</label>
                                    <div className='ms-3'>
                                        <label>In-Person:</label>
                                        <span className='fst-italic ms-3'>
                                            April 24th-25th 2026
                                        </span>
                                    </div>
                                    <div className='ms-3'>
                                        <label>Webinar:</label>
                                        <span className='fst-italic ms-3'>
                                            When 4 person minimum class size is
                                            reached
                                        </span>
                                    </div>
                                </div>
                                <div className='py-2'>
                                    <label className='fw-bold'>
                                        April 23th 2026:
                                    </label>
                                    <span className='ms-3'>
                                        7:00 PM. Optional meet and greet at Brew
                                        Lab{' '}
                                        <i>
                                            (7925 Marty St, Overland Park, KS)
                                        </i>
                                    </span>
                                </div>
                                <div className='py-2'>
                                    <label className='fw-bold'>Day 1:</label>
                                    <span className='ms-3'>
                                        April 24th 2026: 9:00 AM Session 1 at
                                        Brew Lab
                                        <i>
                                            (7925 Marty St, Overland Park, KS)
                                        </i>
                                    </span>
                                    <p>Complimentary lunch at Brew Lab</p>
                                </div>
                                <div className='py-1'>
                                    <label className='fw-bold'>Day 2:</label>
                                    <span className='ms-3'>
                                        April 25th 2026: 9:00 AM tour
                                    </span>
                                    <p>
                                        Tour conclusion at Brew Lab around 3:00
                                        PM
                                    </p>
                                </div>
                            </div>
                            <div className='col-12 col-md-6'>
                                <MapContainer
                                    center={location.coordinates}
                                    zoom={16}
                                    dragging={true}
                                    zoomControl={true}
                                    doubleClickZoom={false}
                                    scrollWheelZoom={true}
                                    tap={false}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
                                    />
                                    <Marker position={location.coordinates}>
                                        <Popup>
                                            <p className='fw-bold'>Brew Lab</p>
                                            <address>
                                                <div>
                                                    {location.addressFirstLine}
                                                </div>
                                                <div>
                                                    {location.addressSecondLine}
                                                </div>
                                            </address>
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='signUpSection gunMetalBackground'>
                    <div className='container py-5'>
                        <div className='row py-5'>
                            <div className='col-12 col-md-6 py-5'>
                                <div className='d-flex align-items-center mb-4 themeText'>
                                    <i className='fas fa-dollar-sign' />
                                    <h2 className='ms-3 mb-0'>
                                        Price/Reservation
                                    </h2>
                                </div>
                                <p>
                                    Thank you for choosing our seminar! Here are
                                    the payment terms:
                                </p>
                                <p>
                                    <b>Cost:</b> $1000 per person.{' '}
                                </p>
                                <p>
                                    <b>Cancellation Policy:</b> Fully refundable
                                    if canceled up to 1 month before the class.
                                </p>
                                <p>
                                    <b>Payment Instructions:</b> You will
                                    receive detailed payment instructions after
                                    completing the sign-up process.
                                </p>
                                <p>
                                    We look forward to having you at our
                                    seminar!
                                </p>
                            </div>
                            <div className='col-12 col-md-6 py-5 bg-body-secondary rounded-3 text-dark'>
                                <div className='d-flex align-items-center mb-4 themeText'>
                                    <i className='fas fa-list-ul' />
                                    <h2 className='ms-3 mb-0'>Sign Up</h2>
                                </div>
                                <Form onSubmit={handleSignUp} noValidate>
                                    <FormGroup>
                                        <Label for='fullname'>
                                            Full Name
                                            <span className='text-danger'>
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id='fullname'
                                            name='fullname'
                                            required
                                            type='text'
                                            value={formData.fullname}
                                            onChange={handleInputChange}
                                            invalid={!!errors.fullname}
                                        />
                                        <FormFeedback>
                                            {errors.fullname}
                                        </FormFeedback>
                                    </FormGroup>
                                    <FormGroup className='usernameField'>
                                        <Label for='username'>Username</Label>
                                        <Input
                                            id='username'
                                            name='username'
                                            required
                                            type='text'
                                            tabIndex={-1}
                                            value={formData.username}
                                            onChange={handleInputChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for='email'>
                                            Email
                                            <span className='text-danger'>
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id='email'
                                            name='email'
                                            required
                                            type='email'
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            invalid={!!errors.email}
                                        />
                                        <FormFeedback>
                                            {errors.email}
                                        </FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for='phoneNumber'>
                                            Phone Number
                                            <span className='text-danger'>
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id='phoneNumber'
                                            name='phoneNumber'
                                            required
                                            type='tel'
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            invalid={!!errors.phoneNumber}
                                        />
                                        <FormFeedback>
                                            {errors.phoneNumber}
                                        </FormFeedback>
                                    </FormGroup>
                                    <FormGroup tag='fieldset'>
                                        <Label for='attendanceType'>
                                            How will you be attending?
                                        </Label>
                                        <div className='d-flex gap-3'>
                                            <FormGroup check>
                                                <Input
                                                    id='inPerson'
                                                    name='attendanceType'
                                                    type='radio'
                                                    value='In-Person'
                                                    checked={
                                                        formData.attendanceType ===
                                                        'In-Person'
                                                    }
                                                    onChange={handleInputChange}
                                                />
                                                <Label check for='inPerson'>
                                                    In-Person
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check>
                                                <Input
                                                    id='webinar'
                                                    name='attendanceType'
                                                    type='radio'
                                                    value='Webinar'
                                                    checked={
                                                        formData.attendanceType ===
                                                        'Webinar'
                                                    }
                                                    onChange={handleInputChange}
                                                />
                                                <Label check for='webinar'>
                                                    Webinar
                                                </Label>
                                            </FormGroup>
                                        </div>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for='company'>Company</Label>
                                        <Input
                                            id='company'
                                            name='company'
                                            type='text'
                                            value={formData.company}
                                            onChange={handleInputChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for='jobTitle'>Job Title</Label>
                                        <Input
                                            id='jobTitle'
                                            name='jobTitle'
                                            type='text'
                                            value={formData.jobTitle}
                                            onChange={handleInputChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for='hearAboutUs'>
                                            How did you hear about us?
                                        </Label>
                                        <Input
                                            id='hearAboutUs'
                                            name='hearAboutUs'
                                            type='textarea'
                                            maxLength={500}
                                            rows={4}
                                            value={formData.hearAboutUs}
                                            onChange={handleInputChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for='specialRequests'>
                                            Geographic Market
                                        </Label>
                                        <Input
                                            id='specialRequests'
                                            name='specialRequests'
                                            type='text'
                                            value={formData.specialRequests}
                                            onChange={handleInputChange}
                                        />
                                    </FormGroup>
                                    <button
                                        type='submit'
                                        className='btn btn-primary'
                                    >
                                        Submit
                                    </button>
                                    {formSuccess && (
                                        <p className='text-success mt-3 mb-0 fw-bold'>
                                            Thank you for signing up! We'll be
                                            in contact with you soon.
                                        </p>
                                    )}
                                    {formFail && (
                                        <p className='text-danger mt-3 mb-0 fw-bold'>
                                            There was a problem during form
                                            submission. Try reaching us directly
                                            at{' '}
                                            {scramble(
                                                'kcombs@insightcommercial.net'
                                            )}
                                        </p>
                                    )}
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='syllabusSection'>
                    <div className='container py-5'>
                        <div className='row py-5'>
                            <div className='d-flex align-items-center mb-4'>
                                <i className='fas fa-list-ul' />
                                <h3 className='ms-3 mb-0'>Syllabus</h3>
                            </div>
                            <div className='col'>
                                <ListGroup>
                                    <ListGroupItem>
                                        <ListGroupItemHeading>
                                            General
                                        </ListGroupItemHeading>
                                        <ListGroupItemText tag='span'>
                                            <List>
                                                <li>
                                                    Problems with mini-storage
                                                    for the small business
                                                    owner.
                                                </li>
                                                <li>
                                                    Problems with flex
                                                    industrial for the small
                                                    business owner.
                                                </li>
                                                <li>
                                                    What is a{' '}
                                                    <i>
                                                        Contractor Garage&trade;
                                                    </i>
                                                    ?
                                                </li>
                                                <li>
                                                    Who is your customer? Sort
                                                    between 3 different products
                                                    for 3 different customers.
                                                </li>
                                                <li>
                                                    When to build a{' '}
                                                    <i>
                                                        Contractor Garage&trade;
                                                    </i>
                                                    , when to build flex
                                                    industrial, or when to build
                                                    a combination of the two.
                                                </li>
                                                <li>
                                                    When to build mini storage
                                                    in combination with a{' '}
                                                    <i>
                                                        Contractor Garage&trade;
                                                    </i>
                                                    .
                                                </li>
                                            </List>
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                    <ListGroupItem className='bg-body-secondary'>
                                        <ListGroupItemHeading>
                                            Evaluating Supply &amp; Demand
                                        </ListGroupItemHeading>
                                        <ListGroupItemText tag='span'>
                                            <List>
                                                <li>
                                                    Use of commercial real
                                                    estate professionals.
                                                </li>
                                                <li>Demographic study.</li>
                                                <li>
                                                    Old-fashioned investigation.
                                                </li>
                                            </List>
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <ListGroupItemHeading>
                                            Site Selection
                                        </ListGroupItemHeading>
                                        <ListGroupItemText tag='span'>
                                            <List>
                                                <li>Ideal lot size.</li>
                                                <li>Ideal locations.</li>
                                                <li>Ideal topography.</li>
                                                <li>
                                                    Configuration to main road.
                                                </li>
                                                <li>Potential layouts.</li>
                                            </List>
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                    <ListGroupItem className='bg-body-secondary'>
                                        <ListGroupItemHeading>
                                            Hand-drafting your first site plan
                                        </ListGroupItemHeading>
                                        <ListGroupItemText tag='span'>
                                            <List>
                                                <li>
                                                    Set-backs, stormwater
                                                    detention, possible
                                                    easements.
                                                </li>
                                                <li>What are the goals?</li>
                                                <li>
                                                    Discuss the two different
                                                    possible layouts.
                                                </li>
                                            </List>
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <ListGroupItemHeading>
                                            Purchase Contract
                                        </ListGroupItemHeading>
                                        <ListGroupItemText tag='span'>
                                            <List>
                                                <li>
                                                    Working with a
                                                    commercial/land real estate
                                                    agent and/or attorney to
                                                    draft purchase contract.
                                                </li>
                                                <li>
                                                    Contingencies/Negotiation
                                                    deal-points.
                                                </li>
                                                <li>Due diligence.</li>
                                            </List>
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                    <ListGroupItem className='bg-body-secondary'>
                                        <ListGroupItemHeading>
                                            Planning Stage
                                        </ListGroupItemHeading>
                                        <ListGroupItemText tag='span'>
                                            <List>
                                                <li>
                                                    Pre-Preliminary meeting with
                                                    city.
                                                </li>
                                                <li>
                                                    Hiring your design
                                                    professionals (civil
                                                    engineer and architect).
                                                </li>
                                                <li>Preliminary site plan.</li>
                                                <li>
                                                    Locating existing utilities.
                                                    Know when to expect major
                                                    costs.
                                                </li>
                                                <li>Ideal unit sizes.</li>
                                                <li>
                                                    Preliminary meeting with
                                                    city.
                                                </li>
                                                <li>
                                                    Final Site Development plans
                                                    for planning commission/city
                                                    council.
                                                </li>
                                                <li>
                                                    Critical design points we
                                                    have learned over the years
                                                    and often missed by others.
                                                </li>
                                                <li>
                                                    Common problems/hurdles you
                                                    will encounter.
                                                </li>
                                            </List>
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <ListGroupItemHeading>
                                            Pro Forma
                                        </ListGroupItemHeading>
                                        <ListGroupItemText tag='span'>
                                            <List>
                                                <li>
                                                    Basics of commercial real
                                                    estate finance (Pro Forma
                                                    template will be distributed
                                                    in Microsoft Excel).
                                                </li>
                                                <li>
                                                    Build and interpolate
                                                    parameters to create a
                                                    winning financial plan.
                                                </li>
                                                <li>
                                                    Historical construction
                                                    costs will be given out in
                                                    class.
                                                </li>
                                                <li>
                                                    Learn how to benefit from
                                                    post-stabilization value.
                                                    Earn instant net worth!
                                                </li>
                                            </List>
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                    <ListGroupItem className='bg-body-secondary'>
                                        <ListGroupItemHeading>
                                            Lending
                                        </ListGroupItemHeading>
                                        <ListGroupItemText tag='span'>
                                            <List>
                                                <li>
                                                    Common Lending parameters
                                                    (minimum vacancy rate, debt
                                                    coverage ratio, loan to
                                                    value).
                                                </li>
                                                <li>Conventional vs SBA.</li>
                                                <li>Down payment options.</li>
                                                <li>
                                                    Bank versus private equity.
                                                </li>
                                            </List>
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <ListGroupItemHeading>
                                            Syndication
                                        </ListGroupItemHeading>
                                        <ListGroupItemText tag='span'>
                                            <List>
                                                <li>
                                                    Different ways to organize
                                                    (lightly covered).
                                                </li>
                                                <li>
                                                    Cash vs non-cash
                                                    contributions towards
                                                    ownership.
                                                </li>
                                            </List>
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                    <ListGroupItem className='bg-body-secondary'>
                                        <ListGroupItemHeading>
                                            Construction
                                        </ListGroupItemHeading>
                                        <ListGroupItemText tag='span'>
                                            <List>
                                                <li>Permitting.</li>
                                                <li>GC or not to GC.</li>
                                                <li>
                                                    Construction type (mini
                                                    storage/lightweight metal,
                                                    pre-engineered red-iron,
                                                    masonry, concrete tilt-up,
                                                    etc).
                                                </li>
                                                <li>Materials.</li>
                                                <li>
                                                    Discuss: pads, piers,
                                                    concrete thickness,
                                                    foundation types, structural
                                                    slabs.
                                                </li>
                                                <li>
                                                    Sprinklers/firewalls/construction
                                                    types (2B vs 5B and storage
                                                    vs factory).
                                                </li>
                                                <li>
                                                    Inevitable potential
                                                    construction problems and
                                                    delays.
                                                </li>
                                                <li>
                                                    Optional upgrades (polished
                                                    floors, 14' tall doors,
                                                    insulation, HVAC, openers,
                                                    electrical, liners,
                                                    plumbing, common loading
                                                    dock).
                                                </li>
                                                <li>
                                                    AIA Construction draw
                                                    worksheets and typical
                                                    construction draw process.
                                                </li>
                                                <li>
                                                    Protecting yourself with
                                                    insurance certificates, lien
                                                    waivers, and dual checks.
                                                </li>
                                                <li>Restroom(s) details.</li>
                                            </List>
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <ListGroupItemHeading>
                                            Leasing
                                        </ListGroupItemHeading>
                                        <ListGroupItemText tag='span'>
                                            <List>
                                                <li>
                                                    Self-perform or outsource.
                                                </li>
                                                <li>Marketing/Advertising.</li>
                                                <li>
                                                    Benefits to being part of
                                                    the Contractor Garage brand.
                                                </li>
                                                <li>Screening tenants.</li>
                                                <li>Lease details.</li>
                                                <li>Rent roll.</li>
                                            </List>
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                    <ListGroupItem className='bg-body-secondary'>
                                        <ListGroupItemHeading>
                                            Management
                                        </ListGroupItemHeading>
                                        <ListGroupItemText tag='span'>
                                            <List>
                                                <li>
                                                    Self-perform or outsource.
                                                </li>
                                                <li>Welcome letter.</li>
                                                <li>Rent payments/ACH.</li>
                                                <li>
                                                    Being a good property
                                                    manager.
                                                </li>
                                                <li>Common issues.</li>
                                                <li>Bookkeeping.</li>
                                                <li>Move out checklist.</li>
                                                <li>Turning over units.</li>
                                                <li>Evictions.</li>
                                                <li>Maintaining profits.</li>
                                            </List>
                                        </ListGroupItemText>
                                    </ListGroupItem>
                                </ListGroup>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Seminar;
