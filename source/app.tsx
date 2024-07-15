import React, {FC, useState} from 'react';
import {Text, useInput} from 'ink';
import fs from 'fs';
import ytdl, {videoFormat} from 'ytdl-core';
import {Level} from 'interfaces';
import chalk from 'chalk';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';

const App: FC = () => {
	const [level, setLevel] = useState<Level>('url');
	const [formats, setFormats] = useState<videoFormat[]>([]);
	const [url, setURL] = useState('');
	const [loading, setLoading] = useState(false);

	useInput(async (input, key) => {
		if (key.escape) {
			process.exit();
		}
		if (level === 'url') {
			if (key.delete) {
				setURL(url => url.slice(0, url.length - 2));
				return;
			}
			if (key.return) {
				const isValid = ytdl.validateURL(url);
				if (!isValid) {
					console.log(chalk.red('The Entered URL is not valid!'));
					setURL('');
					return;
				}
				try {
					setLoading(true);
					const info = await ytdl.getInfo(url);
					setFormats(info.formats);
					setLevel('quality');
				} catch (error) {
					console.error(error);
				} finally {
					setLoading(false);
				}
				// ytdl(url)
				// 	.on('data', data => {
				// 		console.log(data);
				// 	})
				// 	.pipe(fs.createWriteStream('video.mp4'));

				return;
			}
			if (level === 'url' && Object.values(key).every(item => item === false)) {
				setURL(url => url + input);
			}
		}
	});

	if (level === 'url') {
		return (
			<>
				<Text color={'white'}>
					Please Enter URL: <Text color={'blue'}> {url} </Text>
				</Text>

				{loading && (
					<Text color={'white'}>
						<Spinner type="dots" />
					</Text>
				)}
			</>
		);
	}
	if (level === 'quality') {
		return (
			<SelectInput
				items={formats.map(format => ({
					label: format.qualityLabel,
					value: format.url,
				}))}
				onSelect={({label}) => {
					const format = ytdl.chooseFormat(formats, {
						format: formats.find(item => item.qualityLabel === label),
					});

					console.log(format);
					setLevel('download');
					ytdl(url, {
						format,
					})
						.pipe(fs.createWriteStream('video.mp4'))
						.on('error', error => {
							console.log(error);
							setLoading(false);
						})
						.on('open', () => setLoading(true))
						.on('finish', () => setLoading(false));
				}}
			/>
		);
	}

	if (level === 'download') {
		return (
			<>
				<Spinner type="dots" />
				<Text color={'white'}>Progress: {40} %</Text>
			</>
		);
	}
	return <></>;
};

export default App;
