import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Container, SSRProvider } from 'react-bootstrap';

import '../styles/app.css';

import * as ga from '../lib/ga';

import buildClient from '../api/build-client';
import Footer from '../components/footer/Footer';
import Header from '../components/header/Header';

const MyApp = ({ Component, pageProps, currentUser }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    // When the component is mounted, subscribe to router changes
    // and log those page views
    router.events.on('routeChangeComplete', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
		<SSRProvider>
			<Head>
				<title>ecommercewebsite.me | Women&apos;s Clothing Online Shop</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<Header currentUser={currentUser} {...pageProps} />
			<main className="pb-5" style={{ marginTop: '74px' }}>
				<Container fluid className="px-0">
					<Component currentUser={currentUser} {...pageProps} />
				</Container>
			</main>
			<Footer />
		</SSRProvider>
  );
};

MyApp.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let products = [];
  try {
    const { data: productsData } = await client.get('/api/products');
    products = productsData;
  } catch (err) {
    products = [];
  }

  let orderProducts = [];
  try {
    const { data: orderProductsData } = await client.get('/api/orders/products');
    orderProducts = orderProductsData;
  } catch (err) {
    orderProducts = [];
  }

  let paymentProducts = [];
  try {
    const { data: paymentProductsData } = await client.get('/api/payments/products');
    paymentProducts = paymentProductsData;
  } catch (err) {
    paymentProducts = [];
  }

  let users = [];
  try {
    const { data: usersData } = await client.get('/api/users');
    users = usersData;
  } catch (err) {
    // If no users exist yet, the user service returns 404; treat as empty list.
    users = [];
  }

  let bestseller = [];
  try {
    const { data: bestsellerData } = await client.get('/api/products/bestseller');
    bestseller = bestsellerData;
  } catch (err) {
    // If no bestseller products exist yet, the service can return 404.
    bestseller = [];
  }

  let pageProps = {
    products,
    orderProducts,
    paymentProducts,
    users,
    bestseller
  };
  if (data.currentUser !== null) {
    const { data: myOrders } = await client.get('/api/orders/myorders');
    const { data: myReviews } = await client.get('/api/products/myreviews');

    const { data: orders } = await client.get('/api/orders');

    pageProps = {
      products,
      orderProducts,
      paymentProducts,
      users,
      bestseller,
      myOrders,
      myReviews,
      orders
    };
  }

  return {
    pageProps,
    ...data
  };
};

export default MyApp;
