import React from "react";
import { render, screen } from "@testing-library/react";

import ConversationsPage from "../ConversationsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders conversations page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ConversationsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("conversations-datatable")).toBeInTheDocument();
    expect(screen.getByRole("conversations-add-button")).toBeInTheDocument();
});
