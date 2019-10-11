/**
 * Renders categories at the bottom of the mobile site.
 * https://github.com/jdlrobson/wikipedia-gadgets/tree/master/Gadget-mobile-categories
 * version 1.0.0
 */

function catToLink( category ) {
    return $( '<a>' )
        .attr( 'href', mw.Title.newFromText( category.title ).getUrl() )
        .text( category.title )
        .css( category.hidden ? { display: 'none' } : {} );
}

$( window ).one( 'scroll', function () {
    var api = new mw.Api();
    api.ajax( {
        action: 'query',
        format: 'json',
        clprop: 'hidden',
        formatversion: 2,
        prop: 'categories',
        titles: mw.config.get( 'wgRelevantPageName' ),
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
            mw.user.options.get('showhiddencats' ) === '1' &&
                $( '<div>' ).attr( {
                    id: 'mw-hidden-catlinks',
                    class: 'mw-hidden-catlinks'
                } ).append(
                    [
                        $( '<span>' )
                            .text( 'Hidden categories:' )
                    ].concat( hidden.map( catToLink ) )
                )
        ] ).appendTo( '#bodyContent' );
    } );
} );
