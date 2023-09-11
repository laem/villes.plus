'use client'
import CyclableScoreVignette from '@/CyclableScoreVignette'
import WalkableScoreVignette from '@/WalkableScoreVignette'
import { useEffect, useState } from 'react'
import { LoadingMessage } from './CityResultUI'
import socket from '@/app/socket'

export default function CityNumericResult({ cyclable, ville, initialData }) {
	const [loadingMessage, setLoadingMessage] = useState(null)
	const [socketData, setSocketData] = useState(null)

	useEffect(() => {
		if (!socket) return

		if (initialData.status === 202) {
			setLoadingMessage('⚙️  Le calcul est lancé...')

			const dimension = cyclable ? `cycling` : 'walking',
				scope = `meta`
			socket.emit(`api`, { dimension, scope, ville })
			socket.on(`api/${dimension}/${scope}/${ville}`, function (body) {
				if (body.loading) setLoadingMessage(body.loading)
				else if (body.data) {
					setSocketData(body.data)
					setLoadingMessage(false)
				}
			})
		}
	}, [socket])

	const data = socketData || initialData
	return loadingMessage ? (
		<LoadingMessage>{loadingMessage}</LoadingMessage>
	) : cyclable ? (
		<CyclableScoreVignette data={data} />
	) : (
		<WalkableScoreVignette data={data} />
	)
}
