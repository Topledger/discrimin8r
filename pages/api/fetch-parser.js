import axios from 'axios';

import { NextRequest, NextResponse } from 'next/server';
const idlParserApi = axios.create({
    baseURL: "http://20.127.150.5:8081"
})

/**
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res
 * @returns 
 */
export default async function handler(req, res) {
    const body = req.body;
    console.log('request body', body);

    const response = await idlParserApi.post('fetch-parser', body);
    
    console.log('response data', response.data);
    res.status(200).json(response.data)
}