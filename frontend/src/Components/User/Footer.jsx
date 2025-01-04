import React from 'react';
import Image from '../../assets/Logo1-removebg-preview.png';

import {
	FaFacebook,
	FaInstagram,
	FaLinkedin,
	FaLocationArrow,
	FaMobileAlt,
} from 'react-icons/fa';
import Banner from '../../assets/img9.jpg';

const BannerImg = {
	backgroundImage: `url(${Banner})`,
	backgroundPosition: 'bottom',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover',
	width: '100%',
};

const FooterLinks = [
	{ title: '8th floor, 805' },
	{ title: 'City Avenue Building (Zam Zam Al Mandi Building),' },
	{ title: 'Opposite Pullman Residency Next to Deira City Center,' },
	{ title: 'Port Saeed, Deira,' },
	{ title: 'Dubai, United Arab Emirates.' },
];

const Footer = () => {
	return (
		<div
			style={BannerImg}
			className='text-white'>
			<div className='container py-10'>
				<div
					data-aos='zoom-in'
					className='grid md:grid-cols-3  items-center justify-center'>
					<div className='sm:ml-10 ml-4 sm:mr-0 mr-3 flex flex-col justify-center'>
						<img
							src={Image}
							alt='Logo'
							className='w-32 h-32 object-contain'
						/>
						<h1>
							Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos
							voluptatem nihil cumque maiores adipisci ducimus tempore aperiam
							officiis mollitia aspernatur, incidunt error. Aliquam voluptatibus
							explicabo tempore nulla eos qui pariatur.
						</h1>
					</div>

					<div className='py-14 sm:ml-14 ml-4 '>
						<h1 className='sm:text-3xl text-2xl font-bold  text-left mb-3'>
							Office Location
						</h1>
						<div className='flex flex-col gap-3 text-center sm:text-left'>
							{FooterLinks.map((link) => (
								<p
									className='text-left text-xl text-gray-200'
									key={link.title}>
									<span>{link.title}</span>
								</p>
							))}
						</div>
					</div>

					<div className='ml-[-200px] sm:ml-0'>
						<div className='flex items-center gap-3 mb-6  justify-center'>
							<a href='#'>
								<FaFacebook className='text-3xl' />
							</a>
							<a href='#'>
								<FaInstagram className='text-3xl' />
							</a>
							<a href='#'>
								<FaLinkedin className='text-3xl' />
							</a>
						</div>
						<div className='my-4 text-xl'>
							<div className='flex items-center gap-3 mb-3 justify-center '>
								<FaLocationArrow />
								<p>Lahore, Pakistan</p>
							</div>
							<div className='flex items-center gap-3 mb-3 justify-center '>
								<FaMobileAlt />
								<p>+923091053203</p>
							</div>
							<div className='flex items-center gap-3 mb-3 justify-center '>
								<FaMobileAlt />
								<p>+923091053203</p>
							</div>
							<div className='flex items-center gap-3 mb-3 justify-center '>
								<FaMobileAlt />
								<p>+923091053203</p>
							</div>
							<div className='flex items-center gap-3 justify-center '>
								<FaMobileAlt />
								<p>+923091053203</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
