import React from "react";
import { render, screen } from "@testing-library/react";
import { expect } from "chai";
import UsuarioIndex from "../src/pages/Usuarios";

it("Render UsuarioIndex", async () => {
  render(<UsuarioIndex />);

  const title = await screen.getByText("Usuarios");
  expect(title).to.be.not.null;
});
