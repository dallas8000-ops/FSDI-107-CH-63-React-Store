
# React Store Catalog

A modern, interactive product catalog built with React and Vite. This project demonstrates advanced UI/UX features including product grouping, modal details, keyboard navigation, and beautiful animations.

## Features

- **Chronological Grouping:** Products are grouped by date, each group displays a badge with the count.
- **Product Details Modal:** Click any product to view details in a modal popup.
- **Keyboard Navigation:** Use Escape to close the modal, and arrow keys to navigate between products.
- **Staggered Animations:** Product cards animate in with a staggered effect using Framer Motion.
- **Edit Mode:** Easily edit or delete products directly from the catalog UI.
- **Responsive Design:** Works great on desktop and mobile.

## Tech Stack
- React (functional components, hooks)
- Vite (fast development server)
- Framer Motion (animations)
- Custom CSS modules

## Getting Started

1. **Install dependencies:**
	```sh
	npm install
	```
2. **Start the development server:**
	```sh
	npm run dev
	```
3. **Open in browser:**
	Visit [http://localhost:5173](http://localhost:5173) (or as shown in your terminal)

## Project Structure
- `src/components/` — UI components (Catalog, ItemCard, ProductModal, etc.)
- `src/data/products.js` — Product data source (with date field)
- `src/styles/` — CSS for layout, effects, and animations
- `server/` — (Optional) Backend server for API/data

## Customization
- Add/edit products in `src/data/products.js`.
- Adjust animation timing in `Catalog.jsx` (Framer Motion settings).
- Update styles in `src/styles/Catalog.css` and related CSS files.

## License
MIT
