import { Directus } from '@directus/sdk';
import { useEffect, useState } from 'react';

const Test = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const d = new Directus(process.env.NEXT_PUBLIC_API_BASE_URL);
    d.items('directus_users')
      .readByQuery()
      .then((items) => items.data)
      .then((_users) => {
        setUsers(_users);
      });
  },[]);

  return <div>{JSON.stringify(users)}</div>;
};

export default Test;
