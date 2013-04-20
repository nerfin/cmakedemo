#include <stdlib.h>
#include <assert.h>
#include <string.h>
#include <stdio.h>
#include <time.h>
#include <stdarg.h>

#include "eginternal.h"
#include "egcore.h"

static const char *from_me = "(CORE says hello)";

char *eg_core_saysomething(const char *returnthis)
{
	char *buf = NULL;
	size_t total_len = 0;
	if (returnthis == NULL) returnthis = ""; // force it to something
	total_len = strlen(from_me) + strlen(returnthis) + 20;
	buf = malloc(total_len);
	strcpy(buf, "");
	strcat(buf, "(");
	strcat(buf, returnthis);
	strcat(buf, ")");
	strcat(buf, from_me);
	return buf;
}
