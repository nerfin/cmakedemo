#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include <assert.h>
#include <stdarg.h>

#include "buildconfig.h"

#include "egfn/fn.h"

int main(int argc, const char *argv[])
{
	const char *str = NULL;
	char *buf = NULL;
	str = (argc > 1) ? argv[1] : NULL;
	buf = eg_fn_saysomething(str);
	printf("\n%s\n", buf);
	free(buf);
	return 0;
}
