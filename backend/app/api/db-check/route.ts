import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const result = await query('SELECT NOW()');
        return NextResponse.json({
            message: 'Database connected successfully',
            time: result.rows[0].now
        });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json(
            { error: 'Failed to connect to database', details: (error as Error).message },
            { status: 500 }
        );
    }
}
