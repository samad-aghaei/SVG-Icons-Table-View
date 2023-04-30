{
    const foreignObject = document.createElementNS( 'http://www.w3.org/2000/svg', 'foreignObject' )
    foreignObject.setAttribute( 'width', '100%' )
    foreignObject.setAttribute( 'height', '100%' )

    foreignObject.appendChild( document.createElement( 'span' ) )
    foreignObject.firstElementChild.setAttribute( 'xmlns', 'http://www.w3.org/1999/xhtml' )

    let setHash;

    const showAll = event =>
    {
        let svg = document.querySelector( 'svg' )
        svg.removeAttribute( 'viewBox' )

        if( setHash )
        {
            return
        }

        let uses = [ ...document.querySelectorAll( 'use' ) ].map( use =>
        {
            use.removeAttribute( 'style' )
            return use
        })

        if( location.href.match( /#\w/ ) )
        {
            svg.setAttribute( 'viewBox', '0 0 32 32' )
            foreignObject.replaceWith( ...uses )
            document.querySelector( location.hash )?.style?.setProperty( 'display', 'block' )
        }
        else
        {
            foreignObject.firstElementChild.replaceChildren( ...uses.map( use =>
            {
                let svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' )

                svg.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' )
                svg.appendChild( use )

                let text = document.createElementNS( 'http://www.w3.org/2000/svg', 'text' )
                text.textContent = `#${ use.id }`
                text.setAttribute( 'dx', 74 )
                text.setAttribute( 'dy', 120 )
                text.setAttribute( 'text-anchor', 'middle' )

                svg.appendChild( text )


                svg.addEventListener( 'click', event =>
                {
                    event.preventDefault()
                    event.stopPropagation()
                    document.querySelectorAll( 'svg > foreignObject > span > svg' )
                    .forEach( svg =>
                    {
                        if( svg !== event.target )
                        {
                            svg.removeAttribute( 'style' )
                        }
                    })
                    event.target.style.border = '1px solid #717171'
                    setHash = true
                    location.hash = use.id

                    let text = event.target.querySelector( 'text' )
                    let range = document.createRange()
                    range.selectNode( text )
                    getSelection().removeAllRanges()
                    getSelection().addRange( range )

                    navigator.clipboard.writeText( text.textContent )
                })

                setHash = false

                return svg
            }))

            document.querySelector( 'svg' ).appendChild( foreignObject )

            const span   = document.getElementsByTagName('span')[0]
            const master = document.getElementById('master')

            const resizeObserver = new ResizeObserver( entries =>
            {
              entries.forEach( entry =>
              {
                master.style.height = entry.contentRect.height + 80 + 'px'
              })
            })

            resizeObserver.observe( span )
        }

        event.preventDefault()
        event.stopPropagation()
    }

    addEventListener( 'hashchange', showAll )
    addEventListener( 'load', showAll, { once: true } )
}