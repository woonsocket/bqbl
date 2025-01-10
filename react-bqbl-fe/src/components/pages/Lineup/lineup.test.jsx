import { render as origRender, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MOCK_APP_STATE, MockFirebase } from "../../../testing/mocks";
import { MOCK_REDUX_STATE } from "../../../testing/mocks";
import { AppStateContext } from "../../AppState/app-state";
import { FirebaseContext } from "../../Firebase";
import Lineup from "./lineup";
import configureMockStore from "redux-mock-store";
import { act } from "react";

import { createRoot } from "react-dom/client";

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

function render(ui) {
  function Wrapper({ children }) {
    const mockStore = configureMockStore();
    const store = mockStore(MOCK_REDUX_STATE);
    // console.log(store.getState())
    return (
      <AppStateContext.Provider value={[MOCK_APP_STATE]}>
        <FirebaseContext.Provider value={new MockFirebase()}>
          <Provider store={store}>{children}</Provider>;
        </FirebaseContext.Provider>
      </AppStateContext.Provider>
    );
  }
  return origRender(ui, { wrapper: Wrapper });
}

describe("Lineup", () => {
  it("renders without crashing", async () => {
    // console.log(MOCK_REDUX_STATE)
    act(() => {
      render(<Lineup />);
    });

    await act(async () => {
      await wait();
    });

    screen.logTestingPlaygroundURL();
    // expect(screen.getByText('cade')).toBeInTheDocument();

    // Add more test cases here...
  });
});
// describe('LineupWeek', () => {
//   const mockWeek = {
//     id: '1',
//     teams: [
//       { name: 'Team A', selected: true },
//       { name: 'Team B', selected: false },
//       { name: 'Team C', selected: true },
//       { name: 'Team D', selected: false },
//     ],
//   };

//   test('renders week id', () => {
//     render(<LineupWeek week={mockWeek} uid="uid" league="league" year="2022" dh={true} locked={false} />);
//     expect(screen.getByText('1')).toBeInTheDocument();
//   });

//   test('renders team names and opponents', () => {
//     render(<LineupWeek week={mockWeek} uid="uid" league="league" year="2022" dh={true} locked={false} />);
//     expect(screen.getByText('Team A')).toBeInTheDocument();
//     expect(screen.getByText('Team B')).toBeInTheDocument();
//     expect(screen.getByText('Team C')).toBeInTheDocument();
//     expect(screen.getByText('Team D')).toBeInTheDocument();
//     expect(screen.getByText('Opponent A')).toBeInTheDocument();
//     expect(screen.getByText('Opponent B')).toBeInTheDocument();
//     expect(screen.getByText('Opponent C')).toBeInTheDocument();
//     expect(screen.getByText('Opponent D')).toBeInTheDocument();
//   });

// Add more test cases here...
// });
