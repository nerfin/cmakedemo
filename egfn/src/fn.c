#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <time.h>
#include <stdarg.h>

#include "eginternal.h"
#include "egcore/core.h"
#include "egfn.h"

static const char *from_me = "(FN says hello)";

char *eg_fn_saysomething(const char *returnthis)
{
	char *buf = NULL, *from_core = NULL;
	size_t total_len = 0;
	if (returnthis == NULL) returnthis = ""; // force it to something
	from_core = eg_core_saysomething(NULL);
	total_len = strlen(from_core) + strlen(from_me) + strlen(returnthis) + 20;
	buf = malloc(total_len);
	strcpy(buf, "");
	strcat(buf, "(");
	strcat(buf, returnthis);
	strcat(buf, ")");
	strcat(buf, from_me);
	strcat(buf, from_core);
	free(from_core);
	return buf;
}
