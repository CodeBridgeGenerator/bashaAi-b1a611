import React from "react";
import { render, screen } from "@testing-library/react";

import MessagesPage from "../MessagesPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders messages page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <MessagesPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("messages-datatable")).toBeInTheDocument();
    expect(screen.getByRole("messages-add-button")).toBeInTheDocument();
});
