import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app";
import Providers from "./redux/provider/providers";
import { Toaster } from "react-hot-toast";

const root = createRoot(document.getElementById("root"));
root.render(
 <Providers>
  <Suspense fallback={<div>Loading...</div>}>
      <App />
      <Toaster position="bottom-center" reverseOrder={false} />
  </Suspense>
</Providers>
);


