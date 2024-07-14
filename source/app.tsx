import React, {useEffect, useState} from 'react';
import {Text} from 'ink';

export default function App() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (count < 100) {
			setTimeout(() => setCount(count => count + 1), 10);
		}
	}, [count]);
	return <Text color={'green'}>The Progress is: {count}</Text>;
}
