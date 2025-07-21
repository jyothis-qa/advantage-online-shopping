const generateUser = () => {
  const timestamp = Date.now().toString();
  const username = `user${timestamp}`.slice(0, 15);
  return {
    username,
    email: `${username}@testmail.com`,
    password: 'Test@1234',
    firstName: 'Guest',
    lastName: 'User',
    phone: '1234567890',
    country: 'India',
    city: 'Delhi',
    address: '123 Guest Lane',
    state: 'DL',
    postalCode: '110001',
    payment: {
      username,
      password: 'SafePay123!'
    }
  };
};

module.exports = { generateUser };
