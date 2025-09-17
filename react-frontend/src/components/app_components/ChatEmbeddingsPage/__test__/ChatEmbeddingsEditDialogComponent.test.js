import React from "react";
import { render, screen } from "@testing-library/react";

import ChatEmbeddingsEditDialogComponent from "../ChatEmbeddingsEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders chatEmbeddings edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ChatEmbeddingsEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("chatEmbeddings-edit-dialog-component")).toBeInTheDocument();
});
