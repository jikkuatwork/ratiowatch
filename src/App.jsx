import React, { useState } from "react"
import styled from "styled-components"
import { Analytics } from "@vercel/analytics/react"

import RatePanel from "./components/RatePanel"
import AddForm from "./components/AddForm"
import { CryptoCompare } from "./utils"
import { useLocalStorage } from "./components/useLocalStorage"
import { pairs as sampleData } from "./data"

export function App() {
  const [viewMode, setViewMode] = useState(true)
  const [pairs, setPairs] = useLocalStorage("pairs", sampleData)
  const [editMode, setEditMode] = useState(false)

  const addPair = (from, to) => {
    setPairs([...pairs, { from, to }])
    setViewMode(!viewMode)
  }

  const removePair = index => {
    setPairs(pairs.filter((_, i) => i !== index))
  }

  return (
    <Wrapper>
      <Container>
        {viewMode &&
          pairs.map((pair, i) => (
            <RatePanel
              key={i}
              handleRemove={() => removePair(i)}
              {...pair}
              API={CryptoCompare}
              editMode={editMode}
            />
          ))}
        {!viewMode && <AddForm handleSubmit={addPair} />}
        <Footer>
          <div className="f">
            {viewMode && !editMode && (
              <Link onClick={() => setViewMode(!viewMode)}>Add</Link>
            )}
            {viewMode && !editMode && (
              <Link onClick={() => setEditMode(!editMode)}>Remove</Link>
            )}
            {!viewMode && <Link onClick={() => setViewMode(true)}>Cancel</Link>}
            {editMode && <Link onClick={() => setEditMode(false)}>Cancel</Link>}
          </div>
        </Footer>
      </Container>
      <Analytics />
    </Wrapper>
  )
}

const Wrapper = styled.div.attrs({
  className: "flex justify-center",
})``

const Container = styled.div.attrs({
  className: "w-100 flex flex-column mt4-ns",
})`
  max-width: 960px;
`

const Link = styled.a.attrs({
  className: "link b pointer mr2",
})``

const Footer = styled.div.attrs({
  className: "f6 code pa3 ph0-ns flex justify-between",
})``
