import prisma from '@repo/db/client'; // Adjust path as needed
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    await prisma.user.create({
      data: {
        email: "dha",
        name: "djfa",
        number: '1234567890', // Provide a valid number
        password: 'securepassword', // Provide a valid password
      },
    });

    return NextResponse.json({
      message: 'User created successfully',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: 'Error creating user',
      },
      { status: 500 }
    );
  }
};
