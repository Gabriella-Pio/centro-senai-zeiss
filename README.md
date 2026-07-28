# SENAI × ZEISS Center of Excellence in Metrology

Official repository for the corporate web system and administrative dashboard of the Center of Excellence in Metrology, located at SENAI Ítalo Bologna (Goiânia/GO, Brazil). The project integrates high-precision industrial metrology, a specialized service catalog, commercial lead generation, and laboratory operational cost management.

---

## Tech Stack

### **Front-end**

- **Next.js (App Router)**: React framework focused on performance, server-side rendering, and SEO.

- **Tailwind CSS**: Utility-first CSS framework for industrial glassmorphism and modern UI design.

- **shadcn/ui & Base UI**: Accessible, customizable component primitives.

- **Lucide React**: Vector icon library.

### **Back-end**

- **NestJS**: Progressive Node.js framework for building scalable, modular, and enterprise-grade APIs in TypeScript.

- **Prisma ORM**: Modern ORM for type-safe relational database management.

- **PostgreSQL**: Relational database for storing leads, operational costs, and metrics.

---

## Project Structure

The project follows a decoupled architecture split into two main directories:

```text

senai-zeiss-metrologia/

├── frontend/ # Next.js Application (Client & Server Components)

│ ├── src/

│ │ ├── app/ # App Router pages (Home, Services, Admin, Contact)

│ │ ├── components/ # Reusable components (Navbar, Footer, Cards)

│ │ └── lib/ # Utilities and API request clients

│ ├── public/ # Static assets and images

│ └── package.json

│

└── backend/ # NestJS API

├── src/

│ ├── modules/ # Business logic modules (Leads, Costs, Services)

│ ├── prisma/ # Database schema and configuration

│ └── main.ts # Application entry point

├── .env # Server environment variables

└── package.json

```

---

## Running the Project Locally

### **Prerequisites**

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 18 or higher)

- [Docker](https://www.docker.com/) (optional, recommended to easily run PostgreSQL)

- Package manager `npm` or `yarn`

---

### **1. Setting Up and Running the Back-end (NestJS)**

1. Navigate to the backend directory:

```bash

cd backend


```

2. Install dependencies:

```bash

npm install


```

3. Create and configure your `.env` file in the root of the `backend` folder based on the example below:

```env

DATABASE_URL="postgresql://user:password@localhost:5432/senai_zeiss?schema=public"

PORT=3333


```

4. Start the database (if using Docker) and run Prisma migrations:

```bash

npx prisma migrate dev


```

5. Start the development server:

```bash

npm run start:dev


```

_The API will be running at `http://localhost:3333`._

---

### **2. Setting Up and Running the Front-end (Next.js)**

1. Open a new terminal and navigate to the frontend directory:

```bash

cd frontend


```

2. Install dependencies:

```bash

npm install


```

3. Create and configure your `.env.local` file in the root of the `frontend` folder pointing to the API:

```env

NEXT_PUBLIC_API_URL="http://localhost:3333"


```

4. Start the Next.js development environment:

```bash

npm run dev


```

_The website will be accessible at `http://localhost:3000`._

---

## Usage Instructions

- **Home Page:** Explore the interactive hero section, institutional overview of the SENAI Ítalo Bologna laboratory, and quick access to core operational areas.

- **Service Catalog:** Use the navigation menu to browse detailed services including dimensional metrology, reverse engineering, 3D scanning, and industrial computed tomography.

- **Quote Request:** Complete the lead forms available on service pages. Data is sent to the back-end, registered in the administrative dashboard, and includes a contextual redirection option to WhatsApp.

- **Administrative Dashboard:** Access the `/admin` route to track lead pipelines, website metrics, and the exclusive operational cost management module (covering energy, air compressors, humidifiers, and laboratory climate control systems).

```

```
