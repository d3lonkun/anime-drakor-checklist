import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()
    const accessCode = process.env.ACCESS_CODE

    if (!accessCode) {
      return NextResponse.json(
        { error: 'Server belum dikonfigurasi. Tambahkan ACCESS_CODE di Vercel.' },
        { status: 500 }
      )
    }

    if (code === accessCode) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: 'ID salah' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json({ error: 'Request tidak valid' }, { status: 400 })
  }
}
