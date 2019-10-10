/**
 * Renders categories at the bottom of the mobile site.
 * 
 */

function catToLink( category ) {
    return $( '<a>' )
        .attr( 'href', mw.Title.newFromText( category.title ).getUrl() )
        .text( category.title )
        .css( category.hidden ? { display: 'none' } : {} );
}

$( window ).one( 'scroll', function () {
    console.log('go')
    var api = new mw.Api();
    api.ajax( {
        action: 'query',
        format: 'json',
        formatversion: 2,
        prop: 'categories',
        titles: mw.config.get( 'wgTitle' ),
        cllimit: '50'
    } ).then( function ( resp ) {
        var categories = resp.query && resp.query.pages && resp.query.pages[0].categories || [],
            hidden = categories.filter( function ( category ) {
                return category.hidden
            } ),
            normal = categories.filter( function ( category ) {
                return !category.hidden
            } );

        $( '<div>' ).attr( 'id', 'catlinks' ).append( [
            $( '<div>' ).attr( {
                id: 'mw-normal-catlinks',
                class: 'mw-normal-catlinks'
            } ).append( [
                $( '<a>' )
                    .attr( 'href', mw.Title.newFromText( 'Help:Category' ).getUrl() )
                    .text( 'Categories:' )
                ].concat( normal.map( catToLink ) )
            ),
            $( '<div>' ).attr( {
                id: 'mw-hidden-catlinks',
                class: 'mw-hidden-catlinks mw-hidden-cats-hidden'
            } ).append( [
                $( '<span>' )
                    .text( 'Hidden categories:' )
                ].concat( normal.map( catToLink ) )
            ].concat( hidden.map( catToLink ) ) )
        ] ).appendTo( '#bodyContent' );
    } );
} );
