import React from "react";
import { AppStateContext } from "../../AppState/app-state";
import { FirebaseContext } from "../../Firebase";
import { MockFirebase, MOCK_APP_STATE, MockApp } from "../../../testing/mocks";
import "@testing-library/jest-dom";
import { act } from "react";
import { screen } from "@testing-library/react";
import { createRoot } from 'react-dom/client';

import PlayerStandingsPage from "./player-standings-page";
import { Provider } from "react-redux";
import store from "../../../redux/store";

const wait = async () => new Promise((resolve) => setTimeout(resolve, 0));

let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});


describe("PlayerStandingsPage", () => {
  it("renders mocked data", async () => {
    act(() => {
      createRoot(container).render(
        <AppStateContext.Provider value={[MOCK_APP_STATE]}>
          <FirebaseContext.Provider value={new MockFirebase()}>
            <MockApp year={"2023"} league={"nbqbl"}>
              <Provider store={store}>
                <PlayerStandingsPage />
              </Provider>
            </MockApp>
          </FirebaseContext.Provider>
        </AppStateContext.Provider>
      )
    });
    await act(async () => {
      await wait();
    });
    // SUPER USEFUL
    // screen.logTestingPlaygroundURL();
    // screen.logTestingPlaygroundURL(screen.getAllByTestId('player-card')[0]);
    expect(screen.getByText(/cade/i)).toBeInTheDocument();
    expect(screen.getByText(/total: 1269/i)).toBeInTheDocument();
  });
});
