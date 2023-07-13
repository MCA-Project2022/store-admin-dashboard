import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(_req: Request,
  { params }: {
    params: { sizeId: string }
  }
) {
  try {

    if (!params.sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.error('[SIZE_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request,
  { params }: {
    params: { storeId: string, sizeId: string }
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is a required field", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is a required field", { status: 400 });
    }
    if (!params.sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value
      }
    })
    return NextResponse.json(size);
  } catch (error) {
    console.error('[SIZE_PATCH]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(_req: Request,
  { params }: {
    params: { storeId: string, sizeId: string }
  }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }


    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.error('[SIZE_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}