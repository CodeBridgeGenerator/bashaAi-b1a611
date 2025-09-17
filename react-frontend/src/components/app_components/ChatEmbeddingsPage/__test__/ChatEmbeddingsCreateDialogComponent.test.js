import React from "react";
import { render, screen } from "@testing-library/react";

import ChatEmbeddingsCreateDialogComponent from "../ChatEmbeddingsCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders chatEmbeddings create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ChatEmbeddingsCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("chatEmbeddings-create-dialog-component")).toBeInTheDocument();
});
