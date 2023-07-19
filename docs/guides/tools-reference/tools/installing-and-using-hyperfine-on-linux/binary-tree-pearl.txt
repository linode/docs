#!/usr/bin/perl

# The Computer Language Benchmarks Game
# https://salsa.debian.org/benchmarksgame-team/benchmarksgame/
#
# contributed by Emanuele Zeppieri
# *reset* by A. Sinan Unur

run( @ARGV );

sub bottomup_tree {
    my $depth = shift;
    return 0 unless $depth;
    --$depth;
    [ bottomup_tree($depth), bottomup_tree($depth) ];
}

sub check_tree {
    return 1 unless ref $_[0];
    1 + check_tree($_[0][0]) + check_tree($_[0][1]);
}

sub stretch_tree {
    my $stretch_depth = shift;
    my $stretch_tree = bottomup_tree($stretch_depth);
    print "stretch tree of depth $stretch_depth\t check: ",
    check_tree($stretch_tree), "\n";
}

sub run {
    my $max_depth = shift;
    my $min_depth = 4;

    $max_depth = $min_depth + 2 if $min_depth + 2 > $max_depth;

    stretch_tree( $max_depth + 1 );

    my $longlived_tree = bottomup_tree($max_depth);

    for ( my $depth = $min_depth; $depth <= $max_depth; $depth += 2 ) {
        my $iterations = 2**($max_depth - $depth + $min_depth);
        my $check = 0;

        foreach (1..$iterations) {
            $check += check_tree( bottomup_tree($depth) );
        }

        print $iterations, "\t trees of depth $depth\t check: ", $check, "\n"
    }

    print "long lived tree of depth $max_depth\t check: ",
        check_tree($longlived_tree), "\n"
}
